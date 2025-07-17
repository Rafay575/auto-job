// src/components/ProfileWizardModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Box,
  Stack,
  TextField,
  Autocomplete,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface Experience { /* ... */ }
interface Education { /* ... */ }
interface ProfileData { /* ... */ }

const steps = [
  'Personal',
  'Contact',
  'About & Skills',
  'Experience',
  'Education',
  'Certifications',
  'Languages',
  'Review & Submit',
];

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProfileData) => void;
};

export default function ProfileWizardModal({ open, onClose, onSubmit }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ProfileData>({
    name: '', dateOfBirth: '', city: '', state: '', country: '',
    email: '', phone: '', website: '', linkedIn: '',
    summary: '', skills: [],
    professional: [{ role:'', company:'', duration:'', responsibilities:[''] }],
    education: [{ degree:'', institution:'', year:'' }],
    certifications: [''],
    languages: [''],
  });

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);
  const handleChange = (field: keyof ProfileData, value: any) =>
    setFormData((d) => ({ ...d, [field]: value }));

  // ... include your updateArray, pushArray, popArray helpers here ...

  const StepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2}>
            <TextField label="Full Name" value={formData.name}
              onChange={e => handleChange('name', e.target.value)} />
            <TextField label="Date of Birth" type="date" InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={e => handleChange('dateOfBirth', e.target.value)} />
            <TextField label="City" value={formData.city}
              onChange={e => handleChange('city', e.target.value)} />
            <TextField label="State" value={formData.state}
              onChange={e => handleChange('state', e.target.value)} />
            <TextField label="Country" value={formData.country}
              onChange={e => handleChange('country', e.target.value)} />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={formData.email}
              onChange={e => handleChange('email', e.target.value)} />
            <TextField label="Phone" value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)} />
            <TextField label="Website" value={formData.website}
              onChange={e => handleChange('website', e.target.value)} />
            <TextField label="LinkedIn URL" value={formData.linkedIn}
              onChange={e => handleChange('linkedIn', e.target.value)} />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2}>
            <TextField label="Summary" multiline rows={4}
              value={formData.summary}
              onChange={e => handleChange('summary', e.target.value)} />
            <Autocomplete multiple freeSolo options={[]}
              value={formData.skills}
              onChange={(_, v) => handleChange('skills', v)}
              renderInput={params => <TextField {...params} label="Skills" />} />
          </Stack>
        );
      // … similarly plug in cases 3–6 (Experience, Education, Certifications, Languages) …
      case 7:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Your Profile</Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {Object.entries(formData).map(([key, val]) => (
                <ListItem key={key}>
                  <ListItemText
                    primary={key}
                    secondary={Array.isArray(val) ? JSON.stringify(val) : String(val)}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Complete Your Profile</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card variant="outlined">
          <CardContent>
            {StepContent()}
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Box sx={{ flex: 1 }} />
        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>Next</Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onSubmit(formData);
              onClose();
            }}
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
