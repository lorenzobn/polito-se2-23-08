const {
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
} = require("./controllers/proposals.js");
const {
  getApplications,
  getApplicationById,
  getReceivedApplications,
  getReceivedApplicationsByThesisId,
  createApplication,
  updateApplication,
  didStudentApply,
} = require("./controllers/applications.js");

const {
  userLogin,
  authorize,
  userRoles,
  login,
  logout,
  assertion,
  tokenVerification,
} = require("./controllers/auth.js");

const express = require("express");

const { fetchSelf } = require("./controllers/users.js");
const router = express.Router();

// api health check
router.get("/", (req, res) => {
  res.status(200).json({ msg: "health check passed! API is alive." });
});

router.get("/self", authorize(userRoles.any), fetchSelf);

/* ADD STUFF HERE */
router.post("/thesis-proposals", authorize(userRoles.teacher), createProposal);
router.get("/thesis-proposals", getProposals);
router.get(
  "/my-thesis-proposals",
  authorize(userRoles.teacher),
  getProposalsByTeacher
);
router.get(
  "/thesis-proposals/search",
  authorize(userRoles.any),
  searchProposal
);
router.get(
  "/thesis-proposals/:proposalId",
  authorize(userRoles.any),
  getProposalbyId
);
router.put(
  "/thesis-proposals/:proposalId",
  authorize(userRoles.teacher),
  updateProposal
);

router.post(
  "/my-applications",
  authorize(userRoles.student),
  createApplication
);
router.get("/my-applications", authorize(userRoles.student), getApplications);
router.get(
  "/my-applications/:applicationId",
  authorize(userRoles.student),
  getApplicationById
);

//router.get("/my-applications/decisions", getApplicationsDecisions);

router.get(
  "/received-applications",
  authorize(userRoles.teacher),
  getReceivedApplications
);

router.get(
  "/received-applications/:thesisId",
  authorize(userRoles.teacher),

  getReceivedApplicationsByThesisId
);

router.put(
  "/received-applications/:applicationId",
  authorize(userRoles.teacher),
  updateApplication
);

router.get(
  "/check-application/:thesisId",
  authorize(userRoles.student),
  didStudentApply
);

//TODO: authorize all these routes
router.get("/ext-cosupervisors", getExtCoSupervisors);

router.get("/cosupervisors", getCoSupervisors);

router.get("/cds", getAllCdS);
router.get("/groups", getAllGroups);

router.get("/login", login);
router.post("/sso/acs", assertion);
router.post("/sso/verification", tokenVerification);

router.post("/logout", logout);

module.exports = router;
