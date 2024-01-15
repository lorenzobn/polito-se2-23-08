const pool = require("../db/connection");
const Joi = require("@hapi/joi");
const { userRoles } = require("./auth");
const logger = require("../services/logger.js");
const { createNotification } = require("./notifications");
const fs = require("fs");
const path = require("path");
const { userTypes } = require("./users.js");
const uploadPath = "uploads/";

//TO AVOID SENDING A LOT OF EMAILS DURING DEBUGGING
const DEBUG_SEND_EMAIL = false;

const createApplication = async (req, res) => {
  try {
    const applicationSchema = Joi.object({
      student_id: Joi.string().required(),
      thesis_id: Joi.number().integer().required(),
      thesis_status: Joi.string().valid("idle").required(),
      cv_uri: Joi.string().allow(""),
    });

    const { error, value } = applicationSchema.validate(req.body);
    if (error) {
      logger.error(error);
      return res.status(400).json({ msg: error.details[0].message });
    }

    let query = {
      text: "SELECT thesis_proposal.id,thesis_proposal.status,thesis_proposal.title,teacher.id as teacher_id FROM THESIS_PROPOSAL JOIN TEACHER ON thesis_proposal.SUPERVISOR_ID=TEACHER.id WHERE thesis_proposal.id=$1;",
      values: [value.thesis_id],
    };

    let r = await pool.query(query);
    if (r.rowCount == 0) {
      return res.status(400).json({ msg: "Invalid proposal id." });
    }

    if (r.rows[0].status !== "active") {
      return res.status(400).json({
        msg: "Cannot apply to this thesis because it is not active anymore.",
      });
    }

    const file = req.files && req.files.file;

    if (file) {
      await fs.mkdirSync(uploadPath, { recursive: true });
      const uniqueFilename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadPath, uniqueFilename);
      value.cv_uri = filePath;
      await file.mv(filePath);
    }
    query = `
      INSERT INTO thesis_application (student_id, thesis_id, status, cv_uri, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      value.student_id,
      value.thesis_id,
      value.thesis_status,
      value.cv_uri,
      req.session.clock.time,
    ];

    const result = await pool.query(query, values);
    createNotification(
      req.session.user.id,
      userTypes.student,
      "Application Sent!",
      `Your application to ${r.rows[0].title} has been sent successfully!`,
      DEBUG_SEND_EMAIL
    );
    console.log(r.rows[0]);
    createNotification(
      r.rows[0].teacher_id,
      userTypes.teacher,
      "Application Received!",
      `You received an application to '${r.rows[0].title}'.`,
      DEBUG_SEND_EMAIL
    );
    return res
      .status(201)
      .json({ msg: "Application created successfully", data: result.rows[0] });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const downloadCV = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const query = {
      text: "SELECT cv_uri FROM thesis_application WHERE id=$1 AND created_at < $2",
      values: [applicationId, req.session.clock.time],
    };
  
    const result = await pool.query(query);
    if (result.rowCount == 0) {
      return res.status(404).json({ msg: "Resource not found" });
    }
    const filePath = result.rows[0].cv_uri;
    if (!filePath) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.setHeader("Content-Type", "application/pdf");

    res.download(filePath);
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const getApplications = async (req, res) => {
  const query = {
    text: "SELECT student_id, thesis_id, thesis_proposal.status as proposalStatus, thesis_application.status as applicationStatus, cv_uri, title, type, groups.name as groupName, description, required_knowledge, notes, level, programme, deadline FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id JOIN groups ON thesis_proposal.cod_group=groups.cod_group WHERE student_id=$1 AND thesis_proposal.created_at < $2",
    values: [req.session.user.id, req.session.clock.time],
  };
  try {
    const results = await pool.query(query).then((result) => {
      return res.status(200).json({ msg: "OK", data: result.rows });
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const getApplicationById = async (req, res) => {
  const query = {
    text: "SELECT student_id, thesis_application.status, cv_uri, title, type, required_knowledge, notes, level, programme, deadline  FROM THESIS_APPLICATION JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE student_id=$1 AND id=$2 AND thesis_application.created_at < $3 ",
    values: [
      req.session.user.id,
      req.params.applicationId,
      req.session.clock.time,
    ],
  };
  try {
    const results = await pool.query(query).then((result) => {
      if (result.rowCount != 0) {
        return res.status(200).json({ msg: "OK", data: result.rows });
      } else {
        return res.status(404).json({ msg: "Resource not found" });
      }
    });
  } catch (error) {
    errorMsg = "";
    switch (error.code) {
      case "22P02":
        errorMsg = "Invalid data provided.";
        break;
      default:
        errorMsg = "Unknown error occurred.";
        break;
    }
    logger.error(error.message);
    return res.status(500).json({ msg: errorMsg });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    if (req.session.user.role != userRoles.teacher) {
      return res.status(401).json({ msg: "Unauthorized" });
    } else {
      // ok, now check if the application has already been accepted/rejected
      let query = {
        text: "SELECT thesis_proposal.title, thesis_proposal.status as prop_status, thesis_application.thesis_id, thesis_application.status FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE thesis_application.id=$1 AND thesis_application.created_at < $2 AND thesis_proposal.status='active'",
        values: [req.params.applicationId, req.session.clock.time],
      };
      let { thesisTitle, thesisId } = { thesisTitle: "", thesisId: -1 };
      let result = await pool.query(query);
      if (result.rowCount == 0) {
        return res.status(404).json({ msg: "Application or valid proposal not found." });
      } else if (result.rows[0]?.status !== "idle") {
        return res.status(400).json({
          msg: "Cannot update this application because it has already been accepted/rejected.",
        });
      } else {
        thesisId = result.rows[0].thesis_id;
        thesisTitle = result.rows[0].title;
      }
      const updateFields = req.body;
      const applicationSchema = Joi.object({
        status: Joi.string().valid("accepted", "rejected").required(),
      });

      const { error } = applicationSchema.validate(updateFields, {
        allowUnknown: true,
      });

      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const setClause = Object.entries(updateFields)
        .filter(([key, value]) => value !== undefined && value !== "")
        .map(([key, value], index) => `${key} = $${index + 2}`)
        .join(", ");

      if (!setClause) {
        return res
          .status(400)
          .json({ msg: "No valid fields provided for update." });
      }
      //await pool.query("BEGIN");
      if (req.body.status === "accepted") {
        //if it has been accepted, you should cancel all the other pending applications
        logger.info("Canceling...");
        if (
          cancellApplicationsForThesis(
            thesisId,
            thesisTitle,
            req.session.clock.time,
            applicationId
          ) == -1
        ) {
          throw {
            code: 500,
            message: "Error while trying to update application status",
          };
        }
        logger.info("Done!");
        if (archiveProposal(thesisId, req.session.clock.time) == -1) {
          throw {
            code: 500,
            message: "Error while trying to archive the proposal",
          };
        }
      }

      query = `
        UPDATE thesis_application
        SET ${setClause}
        WHERE id = $1 AND created_at < $3
        RETURNING *;
      `;

      const values = [
        applicationId,
        ...Object.values(updateFields).filter((value) => value !== undefined),
        req.session.clock.time,
      ];

      result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw {
          code: 404,
          message: "Application not found.",
        };
      }
      //await pool.query("COMMIT");
      const result2 = await pool.query(
        "SELECT * FROM THESIS_APPLICATION WHERE id = $1",
        [applicationId]
      );
      const studentId = result2?.rows[0]?.student_id;

      createNotification(
        studentId,
        userTypes.student,
        `Application Updated`,
        `Your application status for "${thesisTitle}" has been updated! Please check your applications section.`,
        DEBUG_SEND_EMAIL
      );

      return res.status(200).json({
        msg: "Application updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error) {
    logger.error(error.message);
    //await pool.query("ROLLBACK");
    return res.status(error?.code || 500).json({ msg: error.message });
  }
};

const cancellApplicationsForThesis = async (
  thesisId,
  thesisTitle,
  time,
  applicationId
) => {
  try {
    let query = {
      text: "UPDATE thesis_application SET status = 'cancelled' WHERE thesis_id=$1 AND created_at < $2 AND id<>$3 RETURNING *",
      values: [thesisId, time, applicationId],
    };
    let result = await pool.query(query);
    if (result.rowCount >= 0) {
      for (let i = 0; i < result.rowCount; i++) {
        if (thesisTitle.length > 0) {
          createNotification(
            result.rows[i].student_id,
            userTypes.student,
            `Application Updated`,
            `Your application status for "${thesisTitle}" has been updated! Please check your applications section.`,
            DEBUG_SEND_EMAIL
          );
        } else {
          createNotification(
            result.rows[i].student_id,
            userTypes.student,
            `Application Updated`,
            `Your applications status has been updated! Please check your applications section.`,
            DEBUG_SEND_EMAIL
          );
        }
      }
    }
    return 0;
  } catch (error) {
    return -1;
  }
};

const getReceivedApplications = async (req, res) => {
  const query = {
    text: "SELECT COUNT(*) AS num_applications, title, description, deadline, thesis_id, thesis_application.status FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE supervisor_id=$1 AND thesis_application.created_at < $2 GROUP BY thesis_id, title, description, deadline, thesis_application.status",
    values: [req.session.user.id, req.session.clock.time],
  };
  try {
    const results = await pool.query(query).then((result) => {
      return res.status(200).json({ msg: "OK", data: result.rows });
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const getReceivedApplicationsByThesisId = async (req, res) => {
  const query = {
    text: "SELECT thesis_application.id as applicationId, student_id, thesis_proposal.status as proposalStatus, thesis_application.status as applicationStatus, cv_uri, title, type, description, required_knowledge, notes, level, programme, deadline FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE supervisor_id=$1 AND thesis_id=$2 AND thesis_application.created_at < $3 ",
    values: [req.session.user.id, req.params.thesisId, req.session.clock.time],
  };
  try {
    const results = await pool.query(query).then((result) => {
      return res.status(200).json({ msg: "OK", data: result.rows });
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const didStudentApply = async (req, res) => {
  const query = {
    text: "SELECT thesis_application.status FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE student_id=$1 AND thesis_id=$2 AND thesis_application.created_at < $3",
    values: [req.session.user.id, req.params.thesisId, req.session.clock.time],
  };
  try {
    const results = await pool.query(query).then((result) => {
      if (result.rowCount == 0)
        return res.status(200).json({
          studentId: req.session.user.id,
          proposalId: req.params.thesisId,
          applied: false,
        });
      else
        return res.status(200).json({
          studentId: req.session.user.id,
          proposalId: req.params.thesisId,
          applied: true,
          applicationStatus: result.rows[0].status,
        });
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

//TODO: remove this from here
const archiveProposal = async (thesisId, time) => {
  try {
    let query = {
      text: "UPDATE thesis_proposal SET status = 'archived' WHERE id=$1 AND created_at < $2",
      values: [thesisId, time],
    };
    let result = await pool.query(query);
    if (result.rowCount >= 0) {
      return 0;
    }
    return -1;
  } catch (error) {
    return -1;
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  didStudentApply,
  createApplication,
  updateApplication,
  getReceivedApplications,
  getReceivedApplicationsByThesisId,
  cancellApplicationsForThesis,
  archiveProposal,
  downloadCV,
};
