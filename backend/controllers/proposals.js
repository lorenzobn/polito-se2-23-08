// import models here
const pool = require("../db/connection");
const logger = require("../services/logger.js");
const Joi = require("@hapi/joi");
const {
  coSupervisorAdd,
  getExtCoSupervisors,
  getCoSupervisors,
  keywordsAdd,
  getKeywords,
  getCoSupThesis,
  getECoSupThesis,
} = require("./utils");
const { createNotification } = require("./notifications.js");
const { userTypes } = require("./users.js");
const {cancellApplicationsForThesis, archiveProposal} = require("./applications.js");

const proposalSchema = Joi.object({
  title: Joi.string().min(8).max(150).required(),
  coSupervisors: Joi.array(),
  type: Joi.string().min(1).max(30).required(),
  description: Joi.string().max(500).required(),
  requiredKnowledge: Joi.string().allow(""),
  notes: Joi.string().allow(""),
  level: Joi.string().required().valid("BSc", "MSc"),
  programme: Joi.string().max(10).required(),
  deadline: Joi.date().required(), //default format is MM/DD/YYYY
  keywords: Joi.array(),
});

// In this schema nothing is required
const proposalSchemaUpdate = Joi.object({
  title: Joi.string().min(8).max(150),
  coSupervisors: Joi.array(),
  type: Joi.string().min(1).max(30),
  description: Joi.string().max(500),
  requiredKnowledge: Joi.string().allow(""),
  notes: Joi.string().allow(""),
  level: Joi.string().valid("BSc", "MSc"),
  programme: Joi.string().max(10),
  deadline: Joi.date(),
  keywords: Joi.array(),
  status: Joi.string(),
});

const getAllCdS = async (req, res) => {
  const query = `
  SELECT * FROM DEGREE;
  `;
  const values = [];
  try {
    const results = await pool.query(query, values);
    return res.status(201).json({ data: results.rows });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const getAllProgrammes = async (req, res) => {
  const query = `
  SELECT * FROM DEGREE;
  `;
  const values = [];
  try {
    const results = await pool.query(query, values);
    return res.status(201).json({ data: results.rows });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const getAllGroups = async (req, res) => {
  const query = `
  SELECT * FROM GROUPS;
  `;
  const values = [];
  try {
    const results = await pool.query(query, values);
    return res.status(201).json({ data: results.rows });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: "Unknown error occurred" });
  }
};

const createProposal = async (req, res) => {
 
  try {
    
    let SUPERVISOR_id = req.session.user.id;
    const { error, value } = proposalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    //parameters proposal
    const {
      title,
      type,
      description,
      requiredKnowledge,
      notes,
      level,
      programme,
      deadline,
      keywords,
      coSupervisors,
    } = req.body;

    for (var i = 0; i < coSupervisors.length; i++) {
      if (
        coSupervisors[i].external != true &&
        coSupervisors[i]?.id === req.session?.user?.id
      ) {
        return res
          .status(400)
          .json({ msg: "The supervisor must not be also a cosupervisor." });
      }
    }

    let r = await pool.query(
      "SELECT COD_DEGREE FROM DEGREE WHERE COD_DEGREE=$1",
      [programme]
    );
    if (!r || !r) {
      return res.status(400).json({ msg: "Invalid Programme/CdS provided." });
    }

    r = await pool.query("SELECT COD_GROUP FROM TEACHER WHERE id=$1", [
      SUPERVISOR_id,
    ]);
    if (!r || !r) {
      return res.status(400).json({ msg: "Invalid supervisor provided." });
    }

    const cod_group = r.rows[0].cod_group;
    let activeStatus = "active";

    if (new Date(deadline) < req.session.clock.time) {
      return res.status(400).json({ msg: "The deadline is passed already!" });
    }

    await pool.query("BEGIN");

    const query = `
      INSERT INTO thesis_proposal (title, SUPERVISOR_id, type, COD_GROUP, description, required_knowledge, notes, level, programme, deadline, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      req.session.clock.time,
    ];

    const result = await pool.query(query, values);
    if (!result || !result.rows) {
      return res.status(500).json({ msg: "Error inserting the proposal." });
    }

    const newId = result.rows[0].id;
    for (var i = 0; i < coSupervisors.length; i++) {
      let r = -1;
      if (coSupervisors[i].isExternal === true) {
        r = await coSupervisorAdd(
          newId,
          coSupervisors[i].name,
          coSupervisors[i].surname,
          true
        );
      } else {
        r = await coSupervisorAdd(
          newId,
          coSupervisors[i].name,
          coSupervisors[i].surname,
          false
        );
      }
      if (r < 0) {
        // abort, error!
        //logging.error(`Error inserting a cosupervisor for the thesis ${newId}`)
        //return res.status(500).json({ msg: "Error during the insertion of the cosupervisors." });
        throw {
          message: "Error during the insertion of the cosupervisors.",
          code: 500,
        };
      }
    }

    for (var i = 0; i < keywords.length; i++) {
      let r = await keywordsAdd(newId, keywords[i], req.session.clock.time);
      if (r < 0) {
        // abort, error!
        //logging.error(`Error inserting a keyword for the thesis ${newId}`)
        //return res.status(500).json({ msg: "Error during the insertion of the keywords." });
        throw {
          message: "Error during the insertion of the keywords.",
          code: 500,
        };
      }
    }
    await pool.query("COMMIT");
    createNotification(
      SUPERVISOR_id,
      userTypes.teacher,
      "Proposal Created",
      `Your proposal '${title}' has been created successfully!`,
      true
    );
    return res
      .status(201)
      .json({ msg: "Proposal created successfully", data: result.rows[0] });
  } catch (error) {
    logger.error(error.message);
    await pool.query("ROLLBACK");
    return res.status(500).json({ msg: error.message });
  }
};


const copyProposal = async (req, res) => {


  const {
    
    title,
    type,
    description,
    requiredKnowledge,
    notes,
    level,
    programme,
    deadline,
    keywords,
    coSupervisors,
  } = req.body;


  const query = {
    text: "SELECT * FROM thesis_proposal WHERE id=$1 AND SUPERVISOR_id=$2 AND created_at < $3 AND status='active' ",
    values: [req.params.proposalId, req.session.user.id, req.session.clock.time] 
  };
  try {
    let result = await pool.query(query);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ msg: "No active proposal found with the given ID." });
    }
  
  const proposalToCopy = result.rows[0];
  
    const insertQuery = 
    `INSERT INTO thesis_proposal (title, SUPERVISOR_id, type, COD_GROUP, description, required_knowledge, notes, level, programme, deadline, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
    `;

    const values = [
      proposalToCopy.title,
      proposalToCopy.supervisor_id,
      proposalToCopy.type,
      proposalToCopy.cod_group,
      proposalToCopy.description,
      proposalToCopy.required_knowledge,
      proposalToCopy.notes,
      proposalToCopy.level,
      proposalToCopy.programme,
      proposalToCopy.deadline,
      proposalToCopy.status,
      req.session.clock.time,
    ];



   const r= await pool.query(insertQuery, values);


    //getting the keywords from the proposal id

    const queryKeywords = `SELECT keyword FROM keywords WHERE thesisId=$1`;
    const valuesKeywords = [req.params.proposalId];
    const resultKeywords = await pool.query(queryKeywords, valuesKeywords);
    const keywords = resultKeywords.rows.map((row) => row.keyword);
    console.log(keywords);

    const newId=r.rows[0].id;
    for (var i = 0; i < keywords.length; i++) {
      let r = await keywordsAdd(newId, keywords[i], req.session.clock.time);
      if (r < 0) {
        // abort, error!
        //logging.error(`Error inserting a keyword for the thesis ${newId}`)
        //return res.status(500).json({ msg: "Error during the insertion of the keywords." });
        throw {
          message: "Error during the insertion of the keywords.",
          code: 500,
        };
      }
    }

 


   //getting the supervisors from the proposal id

  querySupervisors = `SELECT * FROM thesis_co_supervision WHERE thesis_proposal_id=$1`;
  valuesSupervisors = [req.params.proposalId];
  resultSupervisors = await pool.query(querySupervisors, valuesSupervisors);
  const coSupervisorsIds = resultSupervisors.rows.map((row) => row);
  console.log(coSupervisorsIds);
  console.log(coSupervisorsIds.length);
  console.log("cosup 1", coSupervisorsIds[1]);

 


  //getting the names of cosups from cosup ids

  
  for (var i = 0; i < coSupervisorsIds.length; i++) {

    let r=-1;

    if(coSupervisorsIds[i].is_external===false){
    console.log("fin qui titto ok");
    const queryCoSupervisors1 = `SELECT * FROM teacher WHERE id=$1`;
    const valuesCoSupervisors1 = [coSupervisorsIds[i].internal_co_supervisor_id];
    const resultCoSupervisors1 = await pool.query(queryCoSupervisors1, valuesCoSupervisors1);
    const coSupervisor1 = resultCoSupervisors1.rows.map((row) => row);
    console.log(coSupervisor1);
    console.log(newId);
    console.log("name", coSupervisor1.name);
    console.log("surname", coSupervisor1.surname);
    
    r = await coSupervisorAdd(
      newId,
      coSupervisor1[0].name,
      coSupervisor1[0].surname,
      false
    );



  } else if(coSupervisorsIds[i].is_external===true){
    const queryCoSupervisors2 = `SELECT * FROM external_co_supervisor WHERE id=$1`;
    const valuesCoSupervisors2 = [coSupervisorsIds[i].external_co_supervisor_id];
    const resultCoSupervisors2 = await pool.query(queryCoSupervisors2, valuesCoSupervisors2);
    const coSupervisor2 = resultCoSupervisors2.rows.map((row) => row);
   console.log(coSupervisor2);
   console.log(newId);
    r = await coSupervisorAdd(
      newId,
      coSupervisor2[0].name,
      coSupervisor2[0].surname,
      true
    );
  }
console.log("r è" , r);
  if (r < 0) {
    // abort, error!
    //logging.error(`Error inserting a cosupervisor for the thesis ${newId}`)
    //return res.status(500).json({ msg: "Error during the insertion of the cosupervisors." });
    throw {
      message: "Error during the insertion of the cosupervisors.",
      code: 500,
    };
  }

}



    res.status(201).json({ msg: "Proposal copied successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};




const getProposals = async (req, res) => {
  try {
    let q =
      "SELECT * FROM thesis_proposal WHERE created_at < $1 AND deadline > $1";
    let args = [req.session.clock.time];
    if (req.session.user?.role === "student") {
      q =
        "SELECT * FROM thesis_proposal WHERE created_at < $1 AND deadline > $1 AND programme = (SELECT COD_DEGREE FROM student WHERE id = $2 )";
      args.push(req.session.user.id);
    }
    const results = await pool.query(q, args).then((result) => {
      return res.status(200).json({ msg: "OK", data: result.rows });
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: error.message });
  }
};

const getProposalbyId = async (req, res) => {
  const query = {
    text: "SELECT thesis_proposal.id,teacher.name as sName, teacher.surname as sSurname, title,type,groups.name as groupName,description,required_knowledge,notes,level,programme,deadline,status,cod_degree,title_degree FROM thesis_proposal JOIN groups ON thesis_proposal.cod_group=groups.cod_group JOIN degree ON thesis_proposal.programme=degree.cod_degree JOIN teacher ON thesis_proposal.supervisor_id=teacher.id WHERE thesis_proposal.id=$1 AND thesis_proposal.created_at < $2",
    values: [req.params.proposalId, req.session.clock.time],
  };
  try {
    const results = await pool.query(query).then(async (result) => {
      if (result.rowCount != 0) {
        let r = await getKeywords(req.params.proposalId);
        let inC = await getCoSupThesis(req.params.proposalId);
        let exC = await getECoSupThesis(req.params.proposalId);
        return res.status(200).json({
          msg: "OK",
          data: result.rows,
          keywords: r,
          external_co: exC,
          internal_co: inC,
        });
      } else {
        return res.status(404).json({ msg: "Resource not found" });
      }
    });
  } catch (error) {
    errorMsg = "";
    switch (error.code) {
      case "22P02":
        errorMsg = "Invalid data provided";
        break;
      default:
        errorMsg = "Unknown error occurred";
        break;
    }
    return res.status(500).json({ msg: errorMsg });
  }
};

const getProposalsByTeacher = async (req, res) => {
  const query = {
    text: "SELECT * FROM thesis_proposal WHERE supervisor_id=$1 AND created_at < $2",
    values: [req.session.user.id, req.session.clock.time],
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
        errorMsg = "Invalid data provided";
        break;
      default:
        errorMsg = "Unknown error occurred";
        break;
    }
    logger.log(error);
    return res.status(500).json({ msg: errorMsg });
  }
};
const deleteProposal = async (req, res) => {
  const query1 = {
    text: "SELECT * FROM thesis_proposal WHERE id=$1 AND SUPERVISOR_id=$2 AND created_at < $3 AND status='active'",
    values: [
      req.params.proposalId,
      req.session.user.id,
      req.session.clock.time,
    ],
  };
  //cannot delete a proposal with one accepted application
  const query2 = {
    text: "SELECT * FROM thesis_application WHERE thesis_id=$1 AND created_at < $2 AND status='accepted'",
    values: [req.params.proposalId, req.session.clock.time],
  }
  const query3 = {
    text: "UPDATE thesis_proposal SET status=$3 WHERE id=$1 AND created_at < $2",
    values: [req.params.proposalId, req.session.clock.time, 'deleted'],
  };
  try {
    let result = await pool.query(query1);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ msg: "No active proposal found with the given ID." });
    }
    result = await pool.query(query2);
    if (result.rows.length !== 0) {
      return res
        .status(400)
        .json({ msg: "Cannot delete this proposal because there is an accepted application" });
    }
    
    //set other applications (the ones pending) to cancelled
    if (cancellApplicationsForThesis(req.params.proposalId, '', req.session.clock.time, -1) == -1) {
      logger.error(`Error while trying to cancel all the applications done for ${thesisId}`)
      return res.status(500).json({ msg: "Error while trying to update application status" });
    }

    await pool.query(query3);
    // should check result?
    return res
      .status(200)
      .json({ msg: "Proposal has been deleted successfully!" });
  } catch (error) {
    let errorMsg = "";
    switch (error.code) {
      case "22P02":
        errorMsg = "Invalid data provided";
        break;
      default:
        errorMsg = "Unknown error occurred";
        break;
    }
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

const updateProposal = async (req, res) => {
  // TODO: Editing is disabled if there is one accepted application!
  // TODO: Handling update of keywords and co-supervisions
  try {
    const { proposalId } = req.params;

    const updateFields = req.body;
    const {
      title,
      type,
      description,
      requiredKnowledge,
      notes,
      level,
      programme,
      deadline,
      keywords,
      coSupervisors,
    } = req.body;

    const { error } = proposalSchemaUpdate.validate(updateFields)
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    let query = {
      text: "SELECT supervisor_id FROM THESIS_PROPOSAL WHERE thesis_proposal.id=$1;",
      values: [proposalId],
    };

    let r = await pool.query(query);
    if (r.rowCount == 0 || !r.rows[0].supervisor_id) {
      return res.status(400).json({ msg: "Invalid proposal id." });
    }

    logger.info(r);

    if (r.rows[0].supervisor_id !== req.session.user.id) {
      return res.status(401).json({ msg: "Not authorized to update this proposal." });
    }

    //2. Check if there is already an accepted application for this thesis proposal: if yes, cannot edit!
    query = {
      text: "SELECT id FROM THESIS_APPLICATION WHERE thesis_id=$1 AND status='accepted';",
      values: [proposalId],
    };

    r = await pool.query(query);
    if (r.rowCount > 0) {
      return res.status(400).json({ msg: "Cannot modify a proposal because there already an accept application." });
    }

    //3. Is there a deadline?
    if (deadline != undefined && new Date(deadline) < req.session.clock.time) {
      return res.status(400).json({ msg: "The deadline is passed already!" });
    }

    //4. is there a programme?
    if (programme != undefined) {
      r = await pool.query("SELECT COD_DEGREE FROM DEGREE WHERE COD_DEGREE=$1", [
        programme,
      ]);
      if (!r || !r) {
        return res.status(400).json({ msg: "Invalid Programme/CdS provided." });
      }
    }

    //await pool.query('BEGIN');

    if (coSupervisors) {
      //delete all supervisors
      await pool.query("DELETE FROM THESIS_CO_SUPERVISION WHERE THESIS_PROPOSAL_id=$1", [
        proposalId,
      ]);

      for (var i = 0; i < coSupervisors.length; i++) {
        if (coSupervisors[i].external != true && coSupervisors[i]?.id === req.session?.user?.id) {
          return res.status(400).json({ msg: "The supervisor must not be also a cosupervisor." });
        }
        r = -1;
        if (coSupervisors[i].isExternal === true) {
          //TODO: if doesn't exist it returns no error!!!!
          r = await coSupervisorAdd(
            proposalId,
            coSupervisors[i].name,
            coSupervisors[i].surname,
            true
          );
        } else {
          r = await coSupervisorAdd(
            proposalId,
            coSupervisors[i].name,
            coSupervisors[i].surname,
            false
          );
        }
        if (r < 0) {
          throw { message: "Error during the insertion of the cosupervisors.", code: 500 }
        }
      }
    }

    if (keywords) {
      await pool.query("DELETE FROM keywords WHERE thesisId=$1", [
        proposalId,
      ]);
      for (var i = 0; i < keywords.length; i++) {
        r = await keywordsAdd(proposalId, keywords[i]);
        if (r < 0) {
          throw { message: "Error during the insertion of the keywords.", code: 500 }
        }
      }
    }

    if (updateFields.requiredKnowledge) {
      updateFields.required_knowledge = updateFields.requiredKnowledge
      delete updateFields.requiredKnowledge
    }

    const thesisRelation = Object.keys(updateFields).reduce(function (newObj, key) {
      if (['title', 'type', 'description', 'required_knowledge', 'notes', 'level', 'programme', 'deadline'].indexOf(key) !== -1) {
        newObj[key] = updateFields[key];
      }
      return newObj;
    }, {});

    const setClause = Object.entries(thesisRelation)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value], index) => `${key} = $${index + 3}`)
      .join(", ");

    if (!setClause) {
      return res
        .status(400)
        .json({ msg: "No valid fields provided for update." });
    }

    query = `
        UPDATE thesis_proposal
        SET ${setClause}
        WHERE id = $1 AND created_at < $2
        RETURNING *;
      `;

    const values = [
      proposalId,
      req.session.clock.time,
      ...Object.values(thesisRelation),
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Thesis proposal not found." });
    } else {
      createNotification(
        req.session.user.id,
        userTypes.teacher,
        "Proposal Updated!",
        `Your proposal '${result.rows[0].title}' has been updated successfully!`,
        true
      );
    }

    logger.info(result);

    //await pool.query('COMMIT');

    return res.status(200).json({
      msg: "Thesis proposal updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error(error);
    //await pool.query('ROLLBACK');
    return res.status(500).json({ msg: error.message });
  }
};



const searchProposal = async (req, res) => {
  try {
    const proposalSchema = Joi.object({
      title: Joi.string(),
      type: Joi.string(),
      description: Joi.string(),
      required_knowledge: Joi.string(),
      notes: Joi.string(),
      level: Joi.string().valid("BSc", "MSc"),
      programme: Joi.string(),
    });

    const { error, value } = proposalSchema.validate(req.query);

    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    let { title, type, description, required_knowledge, notes, programme } =
      req.query;
    title = title?.toLowerCase();
    type = type?.toLowerCase();
    description = description?.toLowerCase();
    required_knowledge = required_knowledge?.toLowerCase();
    notes = notes?.toLowerCase();
    const query = `
      SELECT * FROM thesis_proposal
      WHERE  LOWER(title) LIKE '%${title}%' OR LOWER(type) LIKE '%${type}%' OR LOWER(description) LIKE '%${description}%' OR LOWER(required_knowledge) LIKE '%${required_knowledge}%' OR LOWER(notes) LIKE '%${notes}%' OR LOWER(programme) LIKE '%${programme}%';
    `;
    // TODO apply virtual clock on this query, I could not understand the query
    const results = await pool.query(query).then((result) => {
      if (result.rowCount != 0) {
        return res.status(200).json({ msg: "OK", data: result.rows });
      } else {
        return res.status(404).json({ msg: "Resource not found" });
      }
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: error.message });
  }
};

const archiveProposalWrap = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const query1 = {
      text: "SELECT * FROM thesis_proposal WHERE id=$1 AND SUPERVISOR_id=$2 AND created_at < $3 AND status='active'",
      values: [
        proposalId,
        req.session.user.id,
        req.session.clock.time,
      ],
    };
    let result = await pool.query(query1);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ msg: "No active proposal found with the given ID." });
    }

    if (
      cancellApplicationsForThesis(
        proposalId,
        '',
        req.session.clock.time,
        -1
      ) == -1
    ) {
      throw {
        code: 500,
        message: "Error while trying to update application status",
      };
    }

    let resCode = await archiveProposal(proposalId, req.session.clock.time);
    if (resCode === -1){
      throw {
        message: "Error while archiving a proposal",
        code: 500,
      };
    }
    return res.status(200).json({ msg: "OK" }) 
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ msg: error.message });
  }
}

module.exports = {
  getProposals,
  getProposalsByTeacher,
  getProposalbyId,
  getExtCoSupervisors,
  getCoSupervisors,
  createProposal,
  updateProposal,
  searchProposal,
  getAllCdS,
  getAllGroups,
  getAllProgrammes,
  deleteProposal,
  archiveProposalWrap,
  copyProposal,
};
