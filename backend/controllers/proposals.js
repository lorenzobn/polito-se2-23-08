// import models here
const pool = require("../db/connection");
const Joi = require("@hapi/joi");

const createProposal = async (req, res) => {
  try {
    const proposalSchema = Joi.object({
      title: Joi.string().required(),
      SUPERVISOR_id: Joi.string().required(),
      coSupervisors: Joi.array(), // TODO: validate array of object in this format [{id: 1, isExternal: true}, {id: 2, isExternal: false}]
      type: Joi.string().required(),
      groups: Joi.string(),
      description: Joi.string().required(),
      requiredKnowledge: Joi.string().required(),
      notes: Joi.string().allow(""),
      level: Joi.string().required(),
      programme: Joi.string().required(),
      deadline: Joi.date().required(),
      status: Joi.string(),
    });

    const { error, value } = proposalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    //receive as a parameter the list of cosupervisors in the format [{id: 1, isExternal: true}, {id: 2, isExternal: false}]
    const {coSupervisors} = req.body;

    //parameters proposal
    const { title, SUPERVISOR_id, type, groups, description, requiredKnowledge, notes, level, programme, deadline, status } = req.body;


    const query = `
      INSERT INTO thesis_proposal (title, SUPERVISOR_id, type, groups, description, required_knowledge, notes, level, programme, deadline, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      title,
      SUPERVISOR_id,
      type,
      groups,
      description,
      requiredKnowledge,
      notes,
      level,
      programme,
      deadline,
      status,
    ];

    const result = await pool.query(query, values);

    //adding co supervisors to the proposal
    const query2 = `
        INSERT INTO THESIS_CO_SUPERVISION (THESIS_PROPOSAL_id, INTERNAL_CO_SUPERVISOR_id, EXTERNAL_CO_SUPERVISOR_id, is_external   )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    //for each co supervisor, add a row in the THESIS_CO_SUPERVISION table
    for(var i = 0; i < coSupervisors.length; i++)
    {
      if(coSupervisors[i].isExternal === true)
      {
        var external = coSupervisors[i].id;
        var internal = null;
      }
      else 
      {
        var external = null;
        var internal = coSupervisors[i].id;
      }

      const values2 = [
        result.rows[0].id,
        internal,
        external,
        coSupervisors[i].isExternal,
      ];
      
      const result2 = await pool.query(query2, values2);
    }

    return res
      .status(201)
      .json({ msg: "Proposal created successfully", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const getProposals = async (req, res) => {
  try {
    const results = await pool
      .query("SELECT * FROM thesis_proposal")
      .then((result) => {
        return res.status(200).json({ msg: "OK", data: result.rows });
      });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

const getProposalbyId = async (req, res) => {
  const query = {
    text: "SELECT * FROM thesis_proposal WHERE id=$1",
    values: [req.params.proposalId],
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

const getProposalsByTeacher = async (req, res) => {
  const query = {
    text: "SELECT * FROM thesis_proposal WHERE supervisor_id=$1",
    values: [req.user.id],
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

const updateProposal = async (req, res) => {
  // TODO check if proposal is owned by the professor who makes the request
  // TODO validation of submitted fields
  try {
    const { proposalId } = req.params;
    const updateFields = req.body;

    const { error } = proposalSchema.validate(updateFields, {
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
      UPDATE thesis_proposal
      SET ${setClause}
      WHERE id = $1
      RETURNING *;
    `;

    const values = [
      proposalId,
      ...Object.values(updateFields).filter((value) => value !== undefined),
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Thesis proposal not found." });
    }

    return res.status(200).json({
      msg: "Thesis proposal updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
};

// TODO: add groups
const searchProposal = async (req, res) => {
  try {
    const proposalSchema = Joi.object({
      title: Joi.string(),
      type: Joi.string(),
      description: Joi.string(),
      required_knowledge: Joi.string(),
      notes: Joi.string(),
      level: Joi.string(),
      programme: Joi.string()
    });

    const { error, value } = proposalSchema.validate(req.query);
    const {title, type, description, required_knowledge, notes, level, programme} = req.query;

    const query = `
      SELECT * FROM thesis_proposal
      WHERE title LIKE '%${title}%' OR type LIKE '%${type}%' OR description LIKE '%${description}%' OR required_knowledge LIKE '%${required_knowledge}%' OR notes LIKE '%${notes}%' OR level LIKE '%${level}%' OR programme LIKE '%${programme}%';
    `;

    const results = await pool.query(query).then((result) => {
      if (result.rowCount != 0) {
        return res.status(200).json({ msg: "OK", data: result.rows });
      } else {
        return res.status(404).json({ msg: "Resource not found" });
      }
    });
  } catch(error)
  {
    console.error(error.message);
    return res.status(500).json({ msg: "An unknown error occurred." });
  }
}


module.exports = {
  getProposals,
  getProposalsByTeacher,
  getProposalbyId,
  createProposal,
  updateProposal,
  searchProposal,
};
