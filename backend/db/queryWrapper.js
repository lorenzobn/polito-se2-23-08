// function virtualClockSensitiveQueryExecuter(q) {
//   let query = q.text;
//   query = query.trim();

//   const selectRegex = /^SELECT\b/i;
//   const insertRegex = /^INSERT\b/i;
//   const updateRegex = /^UPDATE\b/i;
//   const deleteRegex = /^DELETE\b/i;

//   let queryType;
//   if (selectRegex.test(query)) {
//     queryType = "SELECT";
//   } else if (insertRegex.test(query)) {
//     queryType = "INSERT";
//   } else if (updateRegex.test(query)) {
//     queryType = "UPDATE";
//   } else if (deleteRegex.test(query)) {
//     queryType = "DELETE";
//   } else {
//     throw new Error("Unsupported SQL query type");
//   }

//   const tableNameMatch = query.match(/\bFROM\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/i);
//   const tableName = tableNameMatch ? tableNameMatch[1] : null;

//   const conditionMatch = query.match(/\bWHERE\s+(.*)$/i);
//   const condition = conditionMatch ? conditionMatch[1] : null;


//   switch(queryType){
//     case ""
//   }

//   return {
//     type: queryType,
//     table: tableName,
//     condition: condition,
//   };
// }


// const sqlQuery = `SELECT *
//   FROM TEACHER
//   WHERE name = $1 AND surname = $2`;
// const parsedInfo = parseSqlQuery(sqlQuery);
// console.log(parsedInfo);
