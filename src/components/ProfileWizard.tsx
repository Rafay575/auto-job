import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box, Button, Stepper, Step, StepLabel, Typography, Chip, Input,
  Stack, Card, CardContent, CssBaseline, Divider
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { baseUrl } from '../api/baseUrl';
import { type RootState } from '../redux/store';
import AppTheme from '../theme/AppTheme';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';

const steps = [
  'Skills', 'Languages', 'Summary', 'Avatar & Links',
  'Location', 'Education', 'Experience', 'Certifications'
];

const inputStyle = {
  flex: 1,
  minWidth: 0,
  padding: '10px 12px',
  borderRadius: 8,
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  fontSize: 16,
  outline: 'none',
  background: '#fafbfc'
};

type FormType = {
  skills: { value: string }[];
  languages: { language: string; proficiency: string }[];
  summary: string;
  avatar_url: string;
  website: string;
  linkedin: string;
  date_of_birth: string;
  city: string;
  state: string;
  country: string;
  education: { degree: string; institution: string; year: string }[];
  experiences: { role: string; company: string; duration: string }[];
  certifications: { value: string }[];
};

export default function ProfileWizard(props: { disableCustomTheme?: boolean }) {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;

  const {
    control,
    handleSubmit,
   
    trigger,
    formState: { errors }
  } = useForm<FormType>({
    defaultValues: {
      skills: [],
      languages: [],
      summary: '',
      avatar_url: '',
      website: '',
      linkedin: '',
      date_of_birth: '',
      city: '',
      state: '',
      country: '',
      education: [],
      experiences: [],
      certifications: [],
    }
  });

  // Adders
  const [skillInput, setSkillInput] = useState('');
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' });

  const [langInput, setLangInput] = useState({ language: '', proficiency: '' });
  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control, name: 'languages' });

  const [eduInput, setEduInput] = useState({ degree: '', institution: '', year: '' });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });

  const [expInput, setExpInput] = useState({ role: '', company: '', duration: '' });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experiences' });

  const [certInput, setCertInput] = useState('');
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: 'certifications' });

  const [activeStep, setActiveStep] = useState(0);

  // Stepwise Validation Schema
  const validateStep = async () => {
    switch (activeStep) {
      case 0: // Skills
        return await trigger('skills');
      case 1: // Languages
        return await trigger('languages');
      case 2: // Summary
        return await trigger('summary');
      case 3: // Avatar, Links
        return await trigger(['avatar_url', 'linkedin']);
      case 4: // Location
        return await trigger(['date_of_birth', 'city', 'state', 'country']);
      case 5: // Education
        return await trigger('education');
      case 6: // Experience
        return await trigger('experiences');
      default:
        return true;
    }
  };

  const onNext = async () => {
    const ok = await validateStep();
    if (!ok) return;
    if (activeStep === steps.length - 1) {
      handleSubmit(async (data) => {
        const payload = {
          profile: {
            avatar_url: data.avatar_url,
            website: data.website,
            linkedin: data.linkedin,
            date_of_birth: data.date_of_birth,
            city: data.city,
            state: data.state,
            country: data.country,
            summary: data.summary
          },
          skills: data.skills.map(s => ({ skill: s.value })),
          languages: data.languages,
          education: data.education,
          experiences: data.experiences,
          certifications: data.certifications.map(c => ({ certification: c.value }))
        };
        try {
          await axios.post(`${baseUrl}/profile/${userId}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Profile completed!');
        } catch {
          alert('Error submitting profile.');
        }
      })();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  // --- Step Renderers ---

  function renderSkillsStep() {
    return (
      <Stack spacing={2}>
        <Typography fontWeight={600}>What are your main skills?</Typography>
        <Stack direction="row" spacing={1}>
          <Input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            placeholder="Skill"
            style={inputStyle}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSkillAdd(); } }}
          />
          <Button variant="contained" onClick={handleSkillAdd}>Add</Button>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {skillFields.map((f, i) => (
            <Chip key={f.id} label={f.value} sx={{ mb: 1 }} onDelete={() => removeSkill(i)} />
          ))}
        </Stack>
        {errors.skills && <Typography color="error" fontSize={13}>At least 1 skill is required</Typography>}
      </Stack>
    );
  }
  function handleSkillAdd() {
    if (skillInput.trim() && !skillFields.some(f => f.value === skillInput.trim())) {
      appendSkill({ value: skillInput.trim() });
      setSkillInput('');
    }
  }

  function renderLanguagesStep() {
    return (
      <Stack spacing={2}>
        <Typography fontWeight={600}>Languages you speak</Typography>
        <Stack direction="row" spacing={1}>
          <Input
            value={langInput.language}
            placeholder="Language"
            style={inputStyle}
            onChange={e => setLangInput({ ...langInput, language: e.target.value })}
          />
          <Input
            value={langInput.proficiency}
            placeholder="Proficiency (e.g. Fluent)"
            style={inputStyle}
            onChange={e => setLangInput({ ...langInput, proficiency: e.target.value })}
          />
          <Button variant="contained" onClick={handleLangAdd}>Add</Button>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {langFields.map((l, i) => (
            <Chip key={l.id} label={`${l.language} (${l.proficiency})`} sx={{ mb: 1 }} onDelete={() => removeLang(i)} />
          ))}
        </Stack>
        {errors.languages && <Typography color="error" fontSize={13}>At least 1 language is required</Typography>}
      </Stack>
    );
  }
  function handleLangAdd() {
    if (langInput.language && langInput.proficiency &&
      !langFields.some(l => l.language === langInput.language && l.proficiency === langInput.proficiency)) {
      appendLang({ ...langInput });
      setLangInput({ language: '', proficiency: '' });
    }
  }

  function renderSummaryStep() {
    return (
      <Stack spacing={2}>
        <Typography fontWeight={600}>Your professional summary</Typography>
        <Controller
          name="summary"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <textarea {...field}
              rows={4}
              placeholder="Summary"
              style={textareaStyle}
            />
          )}
        />
        {errors.summary && <Typography color="error" fontSize={13}>Summary is required</Typography>}
      </Stack>
    );
  }

  function renderAvatarLinksStep() {
    return (
      <Stack spacing={2}>
        <Typography fontWeight={600}>Profile Picture & Links</Typography>
        <Controller
          name="avatar_url"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              type="url"
              placeholder="Avatar URL"
              style={inputStyle}
            />
          )}
        />
        {errors.avatar_url && <Typography color="error" fontSize={13}>Avatar URL required</Typography>}
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="url"
              placeholder="Website (optional)"
              style={inputStyle}
            />
          )}
        />
        <Controller
          name="linkedin"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              type="url"
              placeholder="LinkedIn"
              style={inputStyle}
            />
          )}
        />
        {errors.linkedin && <Typography color="error" fontSize={13}>LinkedIn required</Typography>}
      </Stack>
    );
  }

  function renderLocationStep() {
    return (
      <Stack spacing={2}>
        <Typography fontWeight={600}>Location</Typography>
        <Controller
          name="date_of_birth"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              style={inputStyle}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="City"
              style={inputStyle}
            />
          )}
        />
        <Controller
          name="state"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="State"
              style={inputStyle}
            />
          )}
        />
        <Controller
          name="country"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Country"
              style={inputStyle}
            />
          )}
        />
        {(errors.date_of_birth || errors.city || errors.state || errors.country) && (
          <Typography color="error" fontSize={13}>All fields required</Typography>
        )}
      </Stack>
    );
  }

 
function renderEducationStep() {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Education history</Typography>
      <Stack direction="row" spacing={1}>
        <Input
          value={eduInput.degree}
          placeholder="Degree"
          style={inputStyle}
          onChange={e => setEduInput({ ...eduInput, degree: e.target.value })}
        />
        <Input
          value={eduInput.institution}
          placeholder="Institution"
          style={inputStyle}
          onChange={e => setEduInput({ ...eduInput, institution: e.target.value })}
        />
        <Input
          value={eduInput.year}
          placeholder="Year"
          style={inputStyle}
          onChange={e => setEduInput({ ...eduInput, year: e.target.value })}
        />
        <Button variant="contained" onClick={handleEduAdd}>Add</Button>
      </Stack>
      <Stack spacing={1}>
        {eduFields.map((e, i) => (
          <Box key={e.id} sx={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
       
            borderRadius: 2,
            p: 2,
            border: '1px solid #ececec'
          }}>
            <Box>
              <Typography fontWeight={700}>{e.degree}</Typography>
              <Typography fontSize={15}>{e.institution} &bull; {e.year}</Typography>
            </Box>
            <Button color="error" size="small" onClick={() => removeEdu(i)}>
              <DeleteIcon fontSize="small" />
            </Button>
          </Box>
        ))}
      </Stack>
      {errors.education && <Typography color="error" fontSize={13}>At least 1 entry required</Typography>}
    </Stack>
  );
}


  function handleEduAdd() {
    if (eduInput.degree && eduInput.institution && eduInput.year &&
      !eduFields.some(e => e.degree === eduInput.degree && e.institution === eduInput.institution && e.year === eduInput.year)) {
      appendEdu({ ...eduInput });
      setEduInput({ degree: '', institution: '', year: '' });
    }
  }

function renderExperienceStep() {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Professional Experience</Typography>
      <Stack direction="row" spacing={1}>
        <Input
          value={expInput.role}
          placeholder="Role"
          style={inputStyle}
          onChange={e => setExpInput({ ...expInput, role: e.target.value })}
        />
        <Input
          value={expInput.company}
          placeholder="Company"
          style={inputStyle}
          onChange={e => setExpInput({ ...expInput, company: e.target.value })}
        />
        <Input
          value={expInput.duration}
          placeholder="Duration"
          style={inputStyle}
          onChange={e => setExpInput({ ...expInput, duration: e.target.value })}
        />
        <Button variant="contained" onClick={handleExpAdd}>Add</Button>
      </Stack>
      <Stack spacing={1}>
        {expFields.map((e, i) => (
          <Box key={e.id} sx={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
       
            borderRadius: 2,
            p: 2,
            border: '1px solid #ececec'
          }}>
            <Box>
              <Typography fontWeight={700}>{e.role}</Typography>
              <Typography fontSize={15}>{e.company} &bull; {e.duration}</Typography>
            </Box>
            <Button color="error" size="small" onClick={() => removeExp(i)}>
              <DeleteIcon fontSize="small" />
            </Button>
          </Box>
        ))}
      </Stack>
      {errors.experiences && <Typography color="error" fontSize={13}>At least 1 entry required</Typography>}
    </Stack>
  );
}


  function handleExpAdd() {
    if (expInput.role && expInput.company && expInput.duration &&
      !expFields.some(e => e.role === expInput.role && e.company === expInput.company && e.duration === expInput.duration)) {
      appendExp({ ...expInput });
      setExpInput({ role: '', company: '', duration: '' });
    }
  }

 function renderCertificationsStep() {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Certifications (optional)</Typography>
      <Stack direction="row" spacing={1}>
        <Input
          value={certInput}
          placeholder="Certification"
          style={inputStyle}
          onChange={e => setCertInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCertAdd(); } }}
        />
        <Button variant="contained" onClick={handleCertAdd}>Add</Button>
      </Stack>
      <Stack spacing={1}>
        {certFields.map((c, i) => (
          <Box key={c.id} sx={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
       
            borderRadius: 2,
            p: 2,
            border: '1px solid #ececec'
          }}>
            <Typography fontWeight={600}>{c.value}</Typography>
            <Button color="error" size="small" onClick={() => removeCert(i)}>
              <DeleteIcon fontSize="small" />
            </Button>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
  function handleCertAdd() {
    if (certInput && !certFields.some(c => c.value === certInput.trim())) {
      appendCert({ value: certInput.trim() });
      setCertInput('');
    }
  }

  // ========== Main Render ==========
  const stepContents = [
    renderSkillsStep(),
    renderLanguagesStep(),
    renderSummaryStep(),
    renderAvatarLinksStep(),
    renderLocationStep(),
    renderEducationStep(),
    renderExperienceStep(),
    renderCertificationsStep()
  ];

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <ColorModeIconDropdown />
      </Box>
      <Stack sx={{
        minHeight: '100dvh',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2
      }}>
        <Card sx={{
          width: '90%',
          maxWidth: 900,
          boxShadow: 3,
          borderRadius: 4,
          p: { xs: 1, sm: 3 }
        }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight={700} textAlign="center">Complete Your Profile</Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box>{stepContents[activeStep]}</Box>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" justifyContent="space-between">
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(a => a - 1)}
                variant="outlined"
                startIcon={<ChevronLeftRoundedIcon />}
              >Back</Button>
              <Button
                onClick={onNext}
                variant="contained"
                endIcon={<ChevronRightRoundedIcon />}
                sx={{ minWidth: 100 }}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppTheme>
  );
}
