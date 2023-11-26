const pool = require("../db/connection");
const Joi = require("@hapi/joi");

// TODO: Only STUDENTS
const createApplication = async (req, res) => {
  
  try {
    const applicationSchema = Joi.object({
      student_id: Joi.string().required(),
      thesis_id: Joi.number().integer().required(),
      thesis_status: Joi.string().valid("idle", "approved", "rejected").required(),
      cv_uri: Joi.string().allow(""),
    });

    const { error, value } = applicationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    const query = `
      INSERT INTO thesis_application (student_id, thesis_id, status, cv_uri)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [value.student_id, value.thesis_id, value.thesis_status, value.cv_uri];
    console.log(values)
    const result = await pool.query(query, values);

    return res
      .status(201)
      .json({ msg: "Application created successfully", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const getApplications = async (req, res) => {
  const query = {
    text: "SELECT student_id, thesis_id, thesis_proposal.status as proposalStatus, thesis_application.status as applicationStatus, cv_uri, title, type, groups.name as groupName, description, required_knowledge, notes, level, programme, deadline FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id JOIN groups ON thesis_proposal.cod_group=groups.cod_group WHERE student_id=$1",
    values: [req.session.user.id],
  };
  try {
    const results = await pool.query(query).then((result) => {
      return res.status(200).json({ msg: "OK", data: result.rows });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};


const getApplicationById = async (req, res) => {
  const query = {
    text: "SELECT student_id, thesis_application.status, cv_uri, title, type, required_knowledge, notes, level, programme, deadline  FROM THESIS_APPLICATION JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE student_id=$1 AND id=$2",
    values: [req.session.user.id, req.params.applicationId],
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
    console.log(error);
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
      console.log(error);
      reject();
    }
  })
}

// TODO: Only TEACHERS, in particular the SUPERVISOR of a thesis
const updateApplication = async (req, res) => {
  // TODO: session-based id
  const loggedProfessor = req.session.user.id;
  notAuthorized = true;
  try {
    const { applicationId } = req.params;
    getSomePromise(req.params.applicationId).then(function(supervisor){
      if (supervisor.supervisor_id == loggedProfessor){
        notAuthorized = false;
      }
    });
    if (notAuthorized){
      return res.status(401).json({ msg: 'Unauthorized' });
    } else {
      // ok, authorized
      const updateFields = req.body;
      const applicationSchema = Joi.object({
        status: Joi.string().valid('accepted','rejected', 'idle').required()
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

      const query = `
        UPDATE thesis_application
        SET ${setClause}
        WHERE id = $1
        RETURNING *;
      `;

      const values = [
        applicationId,
        ...Object.values(updateFields).filter((value) => value !== undefined),
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ msg: "Application not found." });
      }

      return res
        .status(200)
        .json({ msg: "Application updated successfully", data: result.rows[0] });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

// TODO: Only TEACHERS
const getReceivedApplications = async (req, res) => {
  const query = {
    text: "SELECT COUNT(*) AS num_applications, title, description, deadline, thesis_id FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE supervisor_id=$1 GROUP BY thesis_id, title, description, deadline",
    values: [req.session.user.id],
  };
  try {
    const results = await pool.query(query).then((result) => {
      return res.status(200).json({ msg: "OK", data: result.rows });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const getReceivedApplicationsByThesisId = async (req, res) => {
  console.log("querying with :");
  console.log(req.session.user.id);
  const query = {
    text: "SELECT student_id, thesis_proposal.status as proposalStatus, thesis_application.status as applicationStatus, cv_uri, title, type, groups, description, required_knowledge, notes, level, programme, deadline FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE supervisor_id=$1 AND thesis_id=$2",
    values: [req.session.user.id, req.params.thesisId],
  };
  try {
    const results = await pool.query(query).then((result) => {
      return res.status(200).json({ msg: "OK", data: result.rows });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const didStudentApply = async (req, res) => {
  const query = {
    text: "SELECT * FROM thesis_application JOIN thesis_proposal ON thesis_application.thesis_id=thesis_proposal.id WHERE student_id=$1 AND thesis_id=$2",
    values: [req.session.user.id, req.params.thesisId],
  };
  try {
    const results = await pool.query(query).then((result) => {
      if (result.rowCount == 0)
        return res.status(200).json({ studentId : req.session.user.id, proposalId : req.params.thesisId, applied : false });
      else
        return res.status(200).json({ studentId : req.session.user.id, proposalId : req.params.thesisId, applied : true });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};


// TODO: Only STUDENTS
/*
const getApplicationsDecisions = async (req, res) => {
  const query = {
    text: "SELECT title, thesis_application.status FROM THESIS_APPLICATION JOIN thesis_proposal ON thesis_application.thesis_id=propId WHERE student_id=$1",
    values: ["s125"], //should be the logged-in student_id
  };
  try {
    const results = await pool.query(query).then((result) => {
      return res.status(200).json({ msg: "OK", data: result.rows });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
}
*/

module.exports = {
  getApplications,
  getApplicationById,
  didStudentApply,
  createApplication,
  updateApplication,
  getReceivedApplications,
  getReceivedApplicationsByThesisId
};
