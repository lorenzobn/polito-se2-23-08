const {
  getProposals,
  getProposalbyId,
  createProposal,
  updateProposal,
  searchProposal
} = require("./controllers/proposals.js");
const {
  getApplications,
  getApplicationById,
  getReceivedApplications,
  createApplication,
  updateApplication
} = require("./controllers/applications.js");

const {
  userLogin
} = require("./controllers/auth.js");

const express = require("express");
const { verifyToken, verifyStudentToken, verifyTeacherToken } = require('./middleware/authMiddleware');
const router = express.Router();

// api health check
router.get("/", (req, res) => {
  res.status(200).json({ msg: "health check passed! API is alive." });
});

/* ADD STUFF HERE */
router.post("/thesis-proposals", verifyToken, createProposal);
router.get("/thesis-proposals",verifyToken, getProposals);
router.get("/thesis-proposals/search", verifyToken, searchProposal);
router.get("/thesis-proposals/:proposalId", verifyToken, getProposalbyId);
router.put("/thesis-proposals/:proposalId", verifyTeacherToken, updateProposal);

router.post("/my-applications", verifyStudentToken, createApplication);
router.get("/my-applications", verifyStudentToken, getApplications);
router.get("/my-applications/:applicationId", verifyStudentToken, getApplicationById);

//router.get("/my-applications/decisions", getApplicationsDecisions);

router.get("/received-applications", verifyTeacherToken, getReceivedApplications)
router.put("/received-applications/:applicationId", verifyTeacherToken, updateApplication);

// AUTHENTICATION ROUTES
//router.post('/register', userSignup);
router.post('/login', userLogin);

module.exports = router;
