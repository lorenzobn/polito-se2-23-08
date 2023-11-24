const {
  getProposals,
  getProposalsByTeacher,
  getProposalbyId,
  createProposal,
  updateProposal,
  searchProposal,
  getAllCdS,
} = require("./controllers/proposals.js");
const {
  getApplications,
  getApplicationById,
  getReceivedApplications,
  getReceivedApplicationsByThesisId,
  createApplication,
  updateApplication,
} = require("./controllers/applications.js");

const {
  userLogin,
  login,
  assertion,
  tokenVerification,
  authorize,
  logout,
} = require("./controllers/auth.js");

const express = require("express");

const { fetchSelf } = require("./controllers/users.js");
const router = express.Router();

// api health check
router.get("/", (req, res) => {
  res.status(200).json({ msg: "health check passed! API is alive." });
});

router.get("/self", authorize, fetchSelf);

/* ADD STUFF HERE */
router.post("/thesis-proposals", authorize, createProposal);
//router.post("/thesis-proposals", createProposal);
router.get("/thesis-proposals", getProposals);
router.get("/my-thesis-proposals", authorize, getProposalsByTeacher);
router.get("/thesis-proposals/search", authorize, searchProposal);
router.get("/thesis-proposals/:proposalId", authorize, getProposalbyId);
router.put("/thesis-proposals/:proposalId", authorize, updateProposal);

router.post("/my-applications", authorize, createApplication);
router.get("/my-applications", authorize, getApplications);
router.get("/my-applications/:applicationId", authorize, getApplicationById);

//router.get("/my-applications/decisions", getApplicationsDecisions);
router.get("/cds", getAllCdS)

router.get("/received-applications", authorize, getReceivedApplications);

router.get(
  "/received-applications/:thesisId",
  authorize,
  getReceivedApplicationsByThesisId
);

router.put(
  "/received-applications/:applicationId",
  authorize,
  updateApplication
);

// AUTHENTICATION ROUTES
//router.post('/register', userSignup);
router.get("/login", login);
router.post("/logout", logout);

router.post("/sso/acs", assertion);
router.post("/sso/verification", tokenVerification);

module.exports = router;
