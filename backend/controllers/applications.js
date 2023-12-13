const pool = require("../db/connection");
const Joi = require("@hapi/joi");
const { userRoles } = require("./auth");
const logger = require("../services/logger.js");
const { createNotification } = require("./notifications");
const fs = require("fs");
const path = require("path");

const uploadPath = "uploads/";
const createApplication = async (req, res) => {
  try {
    const applicationSchema = Joi.object({
      student_id: Joi.string().required(),
      thesis_id: Joi.number().integer().required(),
      thesis_status: Joi.string()
        .valid("idle", "approved", "rejected")
        .required(),
      cv_uri: Joi.string().allow(""),
    });

    //TODO: is the thesis active? assert(thesis_id.status === active)

    const { error, value } = applicationSchema.validate(req.body);
    if (error) {
      logger.error(error);
      return res.status(400).json({ msg: error.details[0].message });
    }
    const file = req.files && req.files.file;

    if (file) {
      await fs.mkdirSync(uploadPath, { recursive: true });
      const uniqueFilename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadPath, uniqueFilename);
      value.cv_uri = filePath;
      await file.mv(filePath);
    }
    const query = `
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
      `Your application has been sent successfully!`,
      true
    );
    return res
      .status(201)
      .json({ msg: "Application created successfully", data: result.rows[0] });
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

function getSomePromise(applicationId) {
  return new Promise((resolve, reject) => {
    const query = {
      text: "SELECT supervisor_id FROM THESIS_PROPOSAL JOIN thesis_application ON thesis_proposal.id=thesis_application.thesis_id WHERE thesis_application.id=$1;",
      values: [applicationId],
    };
    try {
      const results = pool.query(query).then((result) => {
        resolve(result.rows[0]);
      });
    } catch (error) {
      logger.error(error.message);
      reject();
    }
  });
}

// TODO: Only TEACHERS, in particular the SUPERVISOR of a thesis
const updateApplication = async (req, res) => {
  notAuthorized = true;
  try {
    const { applicationId } = req.params;
    if (req.session.user.role != userRoles.teacher) {
      return res.status(401).json({ msg: "Unauthorized" });
    } else {
      // ok, now check if the application has already been accepted/rejected
      let query = {
        text: "SELECT thesis_application.status FROM thesis_application WHERE id=$1 AND created_at < $2",
        values: [req.params.applicationId, req.session.clock.time],
      };
      let result = await pool.query(query);
      if (result.rowCount == 0) {
        return res.status(404).json({ msg: "Application not found." });
      } else if (result.rows[0]?.status !== "idle") {
        logger.info("400 - cannot update");
        return res.status(400).json({
          msg: "Cannot update this application because it has already been accepted/rejected.",
        });
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
        return res.status(404).json({ msg: "Application not found." });
      }
      createNotification(
        req.session.user.id,
        userTypes.teacher,
        "Application Updated",
        `Your application' has been created successfully!`, //TODO: add title of the application in this text
        true
      );

      return res.status(200).json({
        msg: "Application updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const getReceivedApplications = async (req, res) => {
  const query = {
    text: "SELECT COUNT(*) AS num_applications, title, description, deadline, thesis_id FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE supervisor_id=$1 AND thesis_application.created_at < $2 GROUP BY thesis_id, title, description, deadline",
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

module.exports = {
  getApplications,
  getApplicationById,
  didStudentApply,
  createApplication,
  updateApplication,
  getReceivedApplications,
  getReceivedApplicationsByThesisId,
};
