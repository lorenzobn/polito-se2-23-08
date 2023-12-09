// import models here
const pool = require("../db/connection");
const logger = require('../services/logger.js');

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
            const values2 = [thesisId, null, id, true];
            const result2 = await pool.query(query2, values2);
          } else {
            const values2 = [thesisId, id, null, false];
            const result2 = await pool.query(query2, values2);
          }
          return 0;
        } else {
          return -1;
        }
      });
    } catch (error) {
      logger.error(error);
      return -1;
    }
  };
  
  const getExtCoSupervisors = async (req, res) => {
    const query = `
    SELECT name,surname FROM EXTERNAL_CO_SUPERVISOR;
    `;
    const values = [];
    try {
      const results = await pool.query(query, values)
      return res
        .status(200)
        .json({ data: results.rows });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ msg: "Unknown error occurred" });
    }
  }
  
  const getCoSupervisors = async (req, res) => {
    let query = `
    SELECT id,name,surname FROM TEACHER;
    `;
    let values = [];
    try {
      if (req.session?.user?.role === 'teacher'){
        query = `
        SELECT id,name,surname FROM TEACHER WHERE id!=$1;
        `;
        values = [req.session.user.id];
      }
      const results = await pool.query(query, values)
      return res
        .status(200)
        .json({ data: results.rows });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ msg: "Unknown error occurred" });
    }
  }

  const keywordsAdd = async (thesisId, keyword) => {
    const query = `
    INSERT INTO KEYWORDS VALUES($1, $2);
    `;
    const values = [thesisId, keyword];
    try {
      const results = await pool.query(query, values);
      return 0;
    } catch (error) {
      logger.error(error);
      return -1;
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
      logger.error(error);
      return [];
    }
  }
  
  // This function returns the internal cosupervisors for a specific thesis
  const getCoSupThesis = async (thesisId) => {
    const query = `
    SELECT name,surname FROM TEACHER JOIN THESIS_CO_SUPERVISION ON TEACHER.id=THESIS_CO_SUPERVISION.internal_co_supervisor_id WHERE is_external=FALSE AND thesis_proposal_id=$1;
    `;
    const values = [
      thesisId
    ];
    try {
      const results = await pool.query(query, values)
      return results.rows
    } catch (error) {
      logger.error(error);
      return [];
    }
  }
  
  // This function returns the external cosupervisors for a specific thesis
  const getECoSupThesis = async (thesisId) => {
    const query = `
    SELECT name,surname FROM EXTERNAL_CO_SUPERVISOR JOIN THESIS_CO_SUPERVISION ON EXTERNAL_CO_SUPERVISOR.id=THESIS_CO_SUPERVISION.external_co_supervisor_id WHERE is_external=TRUE AND thesis_proposal_id=$1;
    `;
    const values = [
      thesisId
    ];
    try {
      const results = await pool.query(query, values)
      return results.rows
    } catch (error) {
      logger.error(error);
      return [];
    }
  }

module.exports = {
    coSupervisorAdd,
    getExtCoSupervisors,
    getCoSupervisors,
    keywordsAdd,
    getKeywords,
    getCoSupThesis,
    getECoSupThesis
};