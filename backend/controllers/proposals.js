// import models here
const pool = require("../db/connection");
const Joi = require("@hapi/joi");

const coSupervisorAdd = async (thesisId, name, surname, external) => {
  let query = "";
  const query2 = `
  INSERT INTO THESIS_CO_SUPERVISION (THESIS_PROPOSAL_id, INTERNAL_CO_SUPERVISOR_id, EXTERNAL_CO_SUPERVISOR_id, is_external)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;
  if (external) {
    query = {
      text: "SELECT * FROM EXTERNAL_CO_SUPERVISOR WHERE name=$1 AND surname=$2",
      values: [name, surname],
    };
  } else {
    query = {
      text: "SELECT * FROM TEACHER WHERE name=$1 AND surname=$2",
      values: [name, surname],
    };
  }

  try {
    const results = await pool.query(query).then(async (result) => {
      if (result.rowCount != 0) {
        let id = result.rows[0].id;
        if (external) {
          const values2 = [
            thesisId,
            null,
            id,
            true,
          ];
          const result2 = await pool.query(query2, values2);
        } else {
          const values2 = [
            thesisId,
            id,
            null,
            false,
          ];
          const result2 = await pool.query(query2, values2);
        }


      } else {
        return -1;
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
    return -1;
  }
}

const keywordsAdd = async (thesisId, keyword) => {
  const query = `
  INSERT INTO KEYWORDS VALUES($1, $2);
  `;
  const values = [
    thesisId,
    keyword
  ];
  try {
    const results = await pool.query(query, values);
  } catch (error) {
    return error;
  }
}

const getKeywords = async (thesisId) => {
  const query = `
  SELECT keyword FROM KEYWORDS WHERE thesisId=$1;
  `;
  const values = [
    thesisId
  ];
  try {
    const results = await pool.query(query, values)
    return results.rows
  } catch (error) {
    return error;
  }
}


const getAllCdS = async(req, res) => {
  const query = `
  SELECT * FROM DEPARTMENT;
  `;
  const values = [];
  try {
    const results = await pool.query(query, values)
    return res
    .status(201)
    .json({ data: results.rows});
  } catch (error) {
    return error;
  }
}

const createProposal = async (req, res) => {
  try {
    const proposalSchema = Joi.object({
      title: Joi.string().required(),
      //SUPERVISOR_id: Joi.string().required(), // TODO: should be taken from req.userId
      coSupervisors: Joi.array(),
      type: Joi.string().required(),
      description: Joi.string().required(),
      requiredKnowledge: Joi.string().required(),
      notes: Joi.string().allow(""),
      level: Joi.string().required().valid('BSc', 'MSc'),
      programme: Joi.string().required(),
      deadline: Joi.date().required(), //default format is MM/DD/YYYY
      status: Joi.string(),
      keywords: Joi.array()
    });

    let SUPERVISOR_id = req.userId;
    const { error, value } = proposalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    //parameters proposal
    const { title, type, groups, description, requiredKnowledge, notes, level, programme, deadline, status, keywords, coSupervisors } = req.body;

    const r = await pool.query('SELECT COD_GROUP FROM TEACHER WHERE id=$1', [SUPERVISOR_id]);
    if (!r || !r) {
      return res.status(500).json({ msg: 'Error with the cod_group.' });
    }
    const cod_group = r.rows[0].cod_group;
    let activeStatus = 'active';

    const query = `
      INSERT INTO thesis_proposal (title, SUPERVISOR_id, type, COD_GROUP, description, required_knowledge, notes, level, programme, deadline, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      title,
      SUPERVISOR_id,
      type,
      cod_group,
      description,
      requiredKnowledge,
      notes,
      level,
      programme,
      deadline,
      activeStatus,
    ];

    const result = await pool.query(query, values);
    if (!result || !result.rows) {
      return res.status(500).json({ msg: 'Error inserting the proposal.' });
    }

    const newId = result.rows[0].id;
    //adding co supervisors to the proposal
    //for each co supervisor, add a row in the THESIS_CO_SUPERVISION table
    for (var i = 0; i < coSupervisors.length; i++) {
      if (coSupervisors[i].isExternal === true) {
        let r = await coSupervisorAdd(newId, coSupervisors[i].name, coSupervisors[i].surname, true)
      }
    }

    //let's add keywords now
    for (var i = 0; i < keywords.length; i++) {
      let r = await keywordsAdd(newId, keywords[i]);
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
    text: "SELECT thesis_proposal.id,teacher.name as sName, teacher.surname as sSurname, title,type,groups.name as groupName,description,required_knowledge,notes,level,programme,deadline,status,cod_degree,title_degree FROM thesis_proposal JOIN groups ON thesis_proposal.cod_group=groups.cod_group JOIN degree ON thesis_proposal.programme=degree.cod_degree JOIN teacher ON thesis_proposal.supervisor_id=teacher.id WHERE thesis_proposal.id=$1",
    values: [req.params.proposalId],
  };
  try {
    const results = await pool.query(query).then(async (result) => {
      if (result.rowCount != 0) {
        let r = await getKeywords(req.params.proposalId);
        return res.status(200).json({ msg: "OK", data: result.rows, keywords: r});       
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
    values: [req.userId],
  };
  try {
    console.log
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
  } catch (error) {
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
  getAllCdS
};
