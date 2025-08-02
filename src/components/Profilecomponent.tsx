import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Stack,
  Chip,
  Link,
  CircularProgress,
  Button,
} from "@mui/material";
import { useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SchoolIcon from "@mui/icons-material/School";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import VerifiedIcon from "@mui/icons-material/Verified";
import AppTheme from "../theme/AppTheme";
import { useSelector } from "react-redux";
import axios from "axios";
import { type RootState } from "../redux/store";
import ProfileEditModal from "./ProfileEditModal";
import { useSnack } from "../components/SnackContext";
import dayjs from "dayjs";
import { baseUrl,API_URL } from "../api/baseUrl";
export default function ProfileComponent({
  disableCustomTheme,
}: {
  disableCustomTheme?: boolean;
}) {
   const { state } = useLocation() as { state?: { userId?: number } };

  // 2) grab current auth user
  const { user } = useSelector((s: RootState) => s.auth);

  // 3) pick whichever ID is available

  const userId = state?.userId ?? user?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const { showSnackbar } = useSnack();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  // Image upload handler
  const handleAvatarClick = () => imageInputRef.current?.click();
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/image\/(jpeg|jpg|png)/.test(file.type)) {
      showSnackbar("Only JPG, JPEG, PNG files allowed.", "error");
      return;
    }
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      await axios.post(
        `${baseUrl}/users/${userId}/profile-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      showSnackbar("Profile image updated!", "success");
      fetchProfile();
    } catch {
      showSnackbar("Failed to upload image.", "error");
    }
    setUploadingImage(false);
  };
 
  // CV upload handler
  const handleCVClick = () => cvInputRef.current?.click();
  const handleCVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      showSnackbar("Only PDF files allowed.", "error");
      return;
    }
    setUploadingCV(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      await axios.post(
        `${baseUrl}/users/${userId}/cv`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      showSnackbar("CV uploaded!", "success");
      fetchProfile();
    } catch {
      showSnackbar("Failed to upload CV.", "error");
    }
    setUploadingCV(false);
  };
  // Fetch logic is reusable
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${baseUrl}/profile/${userId}`
      );
      if (data && data.success && data.data) {
        setProfile(data.data);
      } else {
        setError("No profile data found.");
      }
    } catch (err) {
      setError("Failed to load profile.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [userId]);

  // Fallback util
  const get = (value: any, emptyMsg = "-") =>
    value === null || value === undefined || value === "" ? emptyMsg : value;

  if (loading) {
    return (
      <AppTheme disableCustomTheme={disableCustomTheme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </AppTheme>
    );
  }
  if (error || !profile) {
    return (
      <AppTheme disableCustomTheme={disableCustomTheme}>
        <Box sx={{ p: 4 }}>
          <Typography color="error" fontSize={18}>
            {error || "No profile data found."}
          </Typography>
        </Box>
      </AppTheme>
    );
  }

  const p = profile.profile || {};
  const education = profile.education || [];
  const experiences = profile.experiences || [];
  const certifications = profile.certifications || [];
  const skills = profile.skills || [];
  const languages = profile.languages || [];

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <Box sx={{ p: 2, mx: "auto" }}>
        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
          <CardContent>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  {/* Profile Image (shows uploaded one if present, otherwise fallback) */}
                  <Box
                    sx={{ position: "relative", cursor: "pointer" }}
                    onClick={handleAvatarClick}
                    title="Click to change profile image"
                  >
                    <Avatar
                      src={
                        p.profile_image_url
                          ? `${API_URL}${p.profile_image_url}`
                          : get(p.avatar_url, undefined)
                      }
                      alt={get(p.name, "User")}
                      sx={{
                        width: 100,
                        height: 100,
                        border: "3px solid",
                        borderColor: "primary.main",
                        opacity: uploadingImage ? 0.5 : 1,
                        transition: "opacity 0.2s",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                      }}
                    />
                    {uploadingImage && (
                      <CircularProgress
                        size={42}
                        sx={{
                          color: "primary.main",
                          position: "absolute",
                          top: "29px",
                          left: "29px",
                          zIndex: 2,
                        }}
                      />
                    )}
                    {/* Hidden image input */}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {get(p.name, "No Name")}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {get(p.email)}
                    </Typography>
                    {/* Show CV download link if uploaded */}

                    {p.cv_pdf_url && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mt={1}
                      >
                        <InsertDriveFileIcon fontSize="small" color="primary" />
                        <a
                          href={`${API_URL}${p.cv_pdf_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1976d2",
                            textDecoration: "underline",
                            fontWeight: 500,
                            fontSize: 16,
                          }}
                        >
                          View CV
                        </a>
                      </Stack>
                    )}
                  </Box>
                </Box>
                <Stack direction="row" spacing={2}>
                  {/* Upload CV button */}
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleCVClick}
                    disabled={uploadingCV}
                  >
                    {uploadingCV ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Upload CV"
                    )}
                  </Button>
                  {/* Hidden CV input */}
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={handleCVChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setEditOpen(true);
                      setSaveError("");
                    }}
                  >
                    Edit Profile
                  </Button>
                </Stack>
              </Box>
            </Stack>

            <Divider />

            {/* Contact & Location */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={4}
              mt={2}
              mb={4}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon color="primary" />
                <Typography>{get(p.phone)}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon color="primary" />
                <Link
                  href={p.email ? `mailto:${p.email}` : undefined}
                  underline="hover"
                  color="primary"
                >
                  {get(p.email)}
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LanguageIcon color="primary" />
                <Link
                  href={
                    p.website
                      ? p.website.startsWith("http")
                        ? p.website
                        : `https://${p.website}`
                      : undefined
                  }
                  target="_blank"
                  underline="hover"
                  color="primary"
                >
                  {get(p.website)}
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinkedInIcon color="primary" />
                <Link
                  href={
                    p.linkedin || p.linkedIn
                      ? p.linkedin || p.linkedIn
                      : undefined
                  }
                  target="_blank"
                  underline="hover"
                  color="primary"
                >
                  {get(p.linkedin || p.linkedIn)}
                </Link>
              </Stack>
            </Stack>

            {/* Personal Details */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4} mb={4}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Date of Birth:</strong>{" "}
                  {p.date_of_birth || p.dateOfBirth
                    ? dayjs(p.date_of_birth || p.dateOfBirth).isValid()
                      ? dayjs(p.date_of_birth || p.dateOfBirth).format(
                          "MMMM D, YYYY"
                        )
                      : "-"
                    : "-"}
                </Typography>

                <Typography variant="body1">
                  <strong>Location:</strong> {get(p.city)}, {get(p.state)},{" "}
                  {get(p.country)}
                </Typography>
              </Box>
            </Stack>

            {/* Summary */}
            <Typography
              variant="h5"
              color="primary"
              fontWeight="medium"
              gutterBottom
            >
              About Me
            </Typography>
            <Typography variant="body1" paragraph>
              {get(p.summary, "No information given.")}
            </Typography>

            {/* Skills */}
            <Typography
              variant="h5"
              color="primary"
              fontWeight="medium"
              gutterBottom
            >
              Skills
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1} mb={4}>
              {skills.length ? (
                skills.map((s: any, i: number) => (
                  <Chip
                    key={s.skill || i}
                    label={get(s.skill, "-")}
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2">No skills given.</Typography>
              )}
            </Stack>

            {/* Professional Experience */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <WorkOutlineIcon color="primary" />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Professional Experience
              </Typography>
            </Stack>
            <Stack spacing={3} mb={4}>
              {experiences.length ? (
                experiences.map((exp: any, idx: number) => (
                  <Box key={idx} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {get(exp.role, "-")} @ {get(exp.company, "-")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {get(exp.duration, "-")}
                    </Typography>
                    {Array.isArray(exp.responsibilities) &&
                      exp.responsibilities.length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {exp.responsibilities.map(
                            (r: string, rIdx: number) => (
                              <li key={rIdx} style={{ fontSize: "15px" }}>
                                <span style={{ color: "#64748b" }}>{r}</span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No experience given.</Typography>
              )}
            </Stack>

            {/* Education */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <SchoolIcon color="primary" />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Education
              </Typography>
            </Stack>
            <Stack spacing={2} mb={4}>
              {education.length ? (
                education.map((edu: any, idx: number) => (
                  <Box key={idx} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {get(edu.degree, "-")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {get(edu.institution, "-")} {get(edu.year, "-")}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No education given.</Typography>
              )}
            </Stack>

            {/* Certifications */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <VerifiedIcon color="primary" />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Certifications
              </Typography>
            </Stack>
            <Stack spacing={1} mb={4}>
              {certifications.length ? (
                certifications.map((cert: any, i: number) => (
                  <Box key={i} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography fontWeight={600}>
                      • {get(cert.certification, "-")}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">
                  No certifications given.
                </Typography>
              )}
            </Stack>

            {/* Languages */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <LanguageIcon color="primary" />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Languages
              </Typography>
            </Stack>
            <Stack spacing={1}>
              {languages.length ? (
                languages.map((lang: any, i: number) => (
                  <Typography key={i} variant="body1">
                    • {get(lang.language, "-")} ({get(lang.proficiency, "-")})
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No languages given.</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
        <ProfileEditModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          profileData={profile}
          saving={saving}
          error={saveError}
          onSave={async (formData) => {
            setSaving(true);
            setSaveError("");
            try {
              await axios.post(`${baseUrl}/profile/${userId}`, {
                profile: {
                  website: formData.website,
                  linkedin: formData.linkedin,
                  date_of_birth: formData.date_of_birth,
                  city: formData.city,
                  state: formData.state,
                  country: formData.country,
                  summary: formData.summary,
                },
                skills: formData.skills.map((skill) => ({ skill })),
                education: formData.education,
                experiences: formData.experiences,
                certifications: formData.certifications.map(
                  (certification) => ({ certification })
                ),
                languages: formData.languages,
              });
              setEditOpen(false);
              showSnackbar("Profile updated successfully!", "success");
              fetchProfile(); // <--- Refresh data!
            } catch (e) {
              setSaveError("Failed to save. Please try again.");
              showSnackbar("Failed to save. Please try again.", "error");
            }
            setSaving(false);
          }}
        />
      </Box>
    </AppTheme>
  );
}
