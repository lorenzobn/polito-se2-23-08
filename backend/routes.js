const {
  getProposals,
  getProposalsByTeacher,
  getProposalbyId,
  getExtCoSupervisors,
  getCoSupervisors,
  createProposal,
  copyProposal,
  updateProposal,
  searchProposal,
  getAllCdS,
  getAllGroups,
  getAllProgrammes,
  deleteProposal,
  archiveProposalWrap,
} = require("./controllers/proposals.js");
const {
  getApplications,
  getApplicationById,
  getReceivedApplications,
  getReceivedApplicationsByThesisId,
  createApplication,
  updateApplication,
  didStudentApply,
  downloadCV,
} = require("./controllers/applications.js");

const {
  authorize,
  userRoles,
  login,
  logout,
  assertion,
  tokenVerification,
} = require("./controllers/auth.js");
const {
  getNotificationsByUserId,
  markNotificationAsSeen,
} = require("./controllers/notifications.js");
const express = require("express");

const { fetchSelf } = require("./controllers/users.js");
const { setVirtualClock } = require("./controllers/virtualClock.js");
const router = express.Router();

// api health check
router.get("/", (req, res) => {
  res.status(200).json({ msg: "health check passed! API is alive." });
});

router.post("/set-clock", setVirtualClock);

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
  "/thesis-proposals/:proposalId",
  authorize(userRoles.teacher),
  copyProposal
);

router.put(
  "/thesis-proposals/:proposalId/deleted",
  authorize(userRoles.teacher),
  deleteProposal
);

router.put(
  "/thesis-proposals/:proposalId/archived",
  authorize(userRoles.teacher),
  archiveProposalWrap
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
router.get("/received-applications/:applicationId/cv", downloadCV);

router.get(
  "/check-application/:thesisId",
  authorize(userRoles.student),
  didStudentApply
);

//TODO: authorize all these routes
router.get("/ext-cosupervisors", getExtCoSupervisors);

router.get("/cosupervisors", getCoSupervisors);
router.get("/programmes", getAllProgrammes);
router.get("/cds", getAllCdS);
router.get("/groups", getAllGroups);

router.get("/login", login);
router.post("/sso/acs", assertion);
router.post("/sso/verification", tokenVerification);

router.post("/logout", logout);
router.get(
  "/notifications",
  authorize(userRoles.any),
  getNotificationsByUserId
);

router.put(
  "/notifications/:id",
  authorize(userRoles.any),
  markNotificationAsSeen
);

module.exports = router;
