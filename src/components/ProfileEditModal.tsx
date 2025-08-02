import { useState } from "react";
import {
  Modal,
  Box,
  Stack,
  Button,
  Input,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
// Define types for array items
type Skill = string;
type Education = { degree: string; institution: string; year: string };
type Experience = {
  role: string;
  company: string;
  duration: string;
  responsibilities?: string[];
};
type Certification = string;
type Language = { language: string; proficiency: string };

// Props for the modal
interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  profileData: {
    profile: {
      website?: string;
      linkedin?: string;
      date_of_birth?: string;
      city?: string;
      state?: string;
      country?: string;
      summary?: string;
      [key: string]: any;
    };
    skills: { skill: string }[];
    education: Education[];
    experiences: Experience[]; // get responsibilities as array
    certifications: { certification: string }[];
    languages: Language[];
  };
  onSave: (data: {
    website?: string;
    linkedin?: string;
    date_of_birth?: string;
    city?: string;
    state?: string;
    country?: string;
    summary?: string;
    skills: Skill[];
    education: Education[];
    experiences: Experience[];
    certifications: Certification[];
    languages: Language[];
  }) => void;
  saving?: boolean;
  error?: string;
}

export function ProfileEditModal({
  open,
  onClose,
  profileData,
  onSave,
  saving = false,
  error = "",
}: ProfileEditModalProps) {
  // Add .responsibilities: string[] to each experience for editing!
  const [values, setValues] = useState(() => ({
    ...profileData.profile,
    skills: profileData.skills.map((s) => s.skill),
    education: profileData.education.map((e) => ({ ...e })),
    experiences: profileData.experiences.map((e) => ({
      ...e,
      responsibilities:
        e.responsibilities && Array.isArray(e.responsibilities)
          ? [...e.responsibilities]
          : [], // always have an array for editing
    })),
    certifications: profileData.certifications.map((c) => c.certification),
    languages: profileData.languages.map((l) => ({ ...l })),
  }));

  // Helpers for editing array fields
  const handleArrayChange = (
    field: keyof typeof values,
    idx: number,
    key: string,
    value: string
  ) => {
    setValues((old: any) => {
      const arr = [...old[field]];
      if (typeof arr[idx] === "object") arr[idx][key] = value;
      else arr[idx] = value;
      return { ...old, [field]: arr };
    });
  };

  const handleArrayAdd = (field: keyof typeof values, emptyObj: any) => {
    setValues((old: any) => ({
      ...old,
      [field]: [
        ...old[field],
        typeof emptyObj === "object" ? { ...emptyObj } : emptyObj,
      ],
    }));
  };

  const handleArrayDelete = (field: keyof typeof values, idx: number) => {
    setValues((old: any) => ({
      ...old,
      [field]: old[field].filter((_: any, i: number) => i !== idx),
    }));
  };

  // --- Responsibility Handlers (for each experience) ---
  const handleRespChange = (expIdx: number, respIdx: number, value: string) => {
    setValues((old: any) => {
      const exps = [...old.experiences];
      const resps = exps[expIdx].responsibilities
        ? [...exps[expIdx].responsibilities]
        : [];
      resps[respIdx] = value;
      exps[expIdx].responsibilities = resps;
      return { ...old, experiences: exps };
    });
  };

  const handleRespAdd = (expIdx: number) => {
    setValues((old: any) => {
      const exps = [...old.experiences];
      if (!exps[expIdx].responsibilities) exps[expIdx].responsibilities = [];
      exps[expIdx].responsibilities.push("");
      return { ...old, experiences: exps };
    });
  };

  const handleRespDelete = (expIdx: number, respIdx: number) => {
    setValues((old: any) => {
      const exps = [...old.experiences];
      if (exps[expIdx].responsibilities) {
        exps[expIdx].responsibilities = exps[expIdx].responsibilities.filter(
          (_: any, i: number) => i !== respIdx
        );
      }
      return { ...old, experiences: exps };
    });
  };

  // UI for editing array of objects or strings
  const editList = (
    field: keyof typeof values,
    labels: { [key: string]: string },
    emptyObj: any
  ) => {
    // Special handling for experiences (add responsibilities)
    if (field === "experiences") {
      return (
        <Stack spacing={2} mb={2}>
          {(values.experiences as Experience[]).map((exp, expIdx) => (
            <Box
              key={expIdx}
              sx={{ border: "1px solid #333", borderRadius: 2, p: 2, mb: 2 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Input
                  placeholder={labels.role}
                  value={exp.role || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "experiences",
                      expIdx,
                      "role",
                      e.target.value
                    )
                  }
                  sx={{ flex: 1 }}
                />
                <Input
                  placeholder={labels.company}
                  value={exp.company || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "experiences",
                      expIdx,
                      "company",
                      e.target.value
                    )
                  }
                  sx={{ flex: 1 }}
                />
                <Input
                  placeholder={labels.duration}
                  value={exp.duration || ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "experiences",
                      expIdx,
                      "duration",
                      e.target.value
                    )
                  }
                  sx={{ flex: 1 }}
                />
                <IconButton
                  onClick={() => handleArrayDelete("experiences", expIdx)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Stack>
              {/* Responsibilities */}
              <Typography fontWeight={600} mt={2} mb={1} fontSize={14}>
                Responsibilities
              </Typography>
              {(exp.responsibilities || []).map((resp, respIdx) => (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  key={respIdx}
                  sx={{ mb: 1 }}
                >
                  <Input
                    placeholder="Responsibility"
                    value={resp || ""}
                    onChange={(e) =>
                      handleRespChange(expIdx, respIdx, e.target.value)
                    }
                    sx={{ flex: 1 }}
                  />
                  <IconButton onClick={() => handleRespDelete(expIdx, respIdx)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                size="small"
                sx={{ mt: 0.5 }}
                onClick={() => handleRespAdd(expIdx)}
              >
                Add Responsibility
              </Button>
            </Box>
          ))}
          <Button
            size="small"
            onClick={() =>
              handleArrayAdd("experiences", {
                role: "",
                company: "",
                duration: "",
                responsibilities: [],
              })
            }
          >
            Add Experience
          </Button>
        </Stack>
      );
    }

    // Everything else stays the same
    return (
      <Stack spacing={1} mb={2}>
        {(values[field] as any[]).map((item, idx) => (
          <Stack direction="row" spacing={1} alignItems="center" key={idx}>
            {typeof item === "object" ? (
              Object.keys(emptyObj).map((k) => (
                <Input
                  key={k}
                  placeholder={labels[k]}
                  value={item[k] || ""}
                  onChange={(e) =>
                    handleArrayChange(field, idx, k, e.target.value)
                  }
                  sx={{ flex: 1 }}
                />
              ))
            ) : (
              <Input
                placeholder={labels[0]}
                value={item || ""}
                onChange={(e) =>
                  handleArrayChange(field, idx, "", e.target.value)
                }
                sx={{ flex: 1 }}
              />
            )}
            <IconButton onClick={() => handleArrayDelete(field, idx)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        ))}
        <Button
          size="small"
          onClick={() =>
            handleArrayAdd(
              field,
              typeof emptyObj === "object" ? { ...emptyObj } : ""
            )
          }
        >
          Add
        </Button>
      </Stack>
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "97vw", sm: 650 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "95vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Edit Profile
        </Typography>
        <Stack spacing={2}>
          <Input
            fullWidth
            placeholder="Website"
            value={values.website || ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, website: e.target.value }))
            }
          />
          <Input
            fullWidth
            placeholder="LinkedIn"
            value={values.linkedin || ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, linkedin: e.target.value }))
            }
          />

          <DatePicker
            label="Date of Birth"
            value={values.date_of_birth ? dayjs(values.date_of_birth) : null}
            onChange={(date) => {
              setValues((v) => ({
                ...v,
                date_of_birth: date ? date.format("YYYY-MM-DD") : "",
              }));
            }}
            slotProps={{
              textField: { fullWidth: true, variant: "standard" },
            }}
          />

          <Input
            fullWidth
            placeholder="City"
            value={values.city || ""}
            onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
          />
          <Input
            fullWidth
            placeholder="State"
            value={values.state || ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, state: e.target.value }))
            }
          />
          <Input
            fullWidth
            placeholder="Country"
            value={values.country || ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, country: e.target.value }))
            }
          />
          <Input
            fullWidth
            placeholder="Summary"
            value={values.summary || ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, summary: e.target.value }))
            }
          />

          <Typography fontWeight={700} mt={2}>
            Skills
          </Typography>
          {editList("skills", { 0: "Skill" }, "")}

          <Typography fontWeight={700}>Education</Typography>
          {editList(
            "education",
            { degree: "Degree", institution: "Institution", year: "Year" },
            { degree: "", institution: "", year: "" }
          )}

          <Typography fontWeight={700}>Professional Experience</Typography>
          {editList(
            "experiences",
            { role: "Role", company: "Company", duration: "Duration" },
            { role: "", company: "", duration: "", responsibilities: [] }
          )}

          <Typography fontWeight={700}>Certifications</Typography>
          {editList("certifications", { 0: "Certification" }, "")}

          <Typography fontWeight={700}>Languages</Typography>
          {editList(
            "languages",
            { language: "Language", proficiency: "Proficiency" },
            { language: "", proficiency: "" }
          )}
        </Stack>
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={saving}
            onClick={() => onSave(values)}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ProfileEditModal;
