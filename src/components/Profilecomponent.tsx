// src/pages/Profile.tsx
import React from 'react';
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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolIcon from '@mui/icons-material/School';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VerifiedIcon from '@mui/icons-material/Verified';
import AppTheme from '../theme/AppTheme';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';

interface Experience {
  role: string;
  company: string;
  duration: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface UserProfile {
  name: string;
  avatarUrl: string;
  email: string;
  phone: string;
  website: string;
  linkedIn: string;
  dateOfBirth: string;
  city: string;
  state: string;
  country: string;
  summary: string;
  skills: string[];
  professional: Experience[];
  education: Education[];
  certifications: string[];
  languages: string[];
}

export default function ProfileComponent({ disableCustomTheme }: { disableCustomTheme?: boolean }) {
  const user: UserProfile = {
    name: 'Ali Hassan',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'ali.hassan@example.com',
    phone: '+92 300 123 4567',
    website: 'www.alihassan.dev',
    linkedIn: 'linkedin.com/in/alihassan',
    dateOfBirth: 'January 15, 1990',
    city: 'Lahore',
    state: 'Punjab',
    country: 'Pakistan',
    summary: `Passionate Full Stack Developer with 7+ years of experience building
      scalable web applications. Adept at modern JavaScript frameworks,
      API design, and cloud deployment. Loves mentoring juniors and
      contributing to open-source.`,
    skills: [
      'React.js', 'Node.js', 'TypeScript', 'Next.js',
      'GraphQL', 'Docker', 'AWS', 'MongoDB',
    ],
    professional: [
      {
        role: 'Senior Full Stack Developer',
        company: 'Tech Solutions Ltd.',
        duration: '2022 – Present',
        responsibilities: [
          'Led a team of 5 in building a multi-tenant SaaS platform',
          'Architected GraphQL APIs with Apollo Server',
          'Optimized application performance, reducing load times by 40%',
        ],
      },
      {
        role: 'Front-End Developer',
        company: 'WebCraft Inc.',
        duration: '2020 – 2022',
        responsibilities: [
          'Developed responsive UI with React and Material-UI',
          'Integrated payment gateways (Stripe, PayPal)',
          'Collaborated with designers to improve UX flows',
        ],
      },
    ],
    education: [
      { degree: 'B.Sc. Computer Science', institution: 'University of Punjab', year: '2018' },
      { degree: 'F.Sc. Pre-Engineering', institution: 'Government College Lahore', year: '2014' },
    ],
    certifications: [
      'AWS Certified Solutions Architect – Associate',
      'Scrum Master Certified (SMC)',
      'Certified Kubernetes Administrator (CKA)',
    ],
    languages: ['English (Fluent)', 'Urdu (Native)', 'Punjabi (Fluent)'],
  };

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <Box sx={{ p: 2, mx: 'auto' }}>
        {/* Theme toggle */}
      

        <Card sx={{ borderRadius: 1, boxShadow: 4 }}>
          <CardContent>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                sx={{
                  width: 100,
                  height: 100,
                  border: '3px solid',
                  borderColor: 'primary.main',
                }}
              />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {user.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user.email}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            {/* Contact & Location */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} mt={2} mb={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon color="primary" />
                <Typography>{user.phone}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon color="primary" />
                <Link href={`mailto:${user.email}`} underline="hover" color="primary">
                  {user.email}
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LanguageIcon color="primary" />
                <Link href={`https://${user.website}`} target="_blank" underline="hover" color="primary">
                  {user.website}
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LinkedInIcon color="primary" />
                <Link href={`https://${user.linkedIn}`} target="_blank" underline="hover" color="primary">
                  {user.linkedIn}
                </Link>
              </Stack>
            </Stack>

            {/* Personal Details */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} mb={4}>
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Date of Birth:</strong> {user.dateOfBirth}
                </Typography>
                <Typography variant="body1">
                  <strong>Location:</strong> {user.city}, {user.state}, {user.country}
                </Typography>
              </Box>
            </Stack>

            {/* Summary */}
            <Typography variant="h5" color="primary" fontWeight="medium" gutterBottom>
              About Me
            </Typography>
            <Typography variant="body1" paragraph>
              {user.summary}
            </Typography>

            {/* Skills */}
            <Typography variant="h5" color="primary" fontWeight="medium" gutterBottom>
              Skills
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1} mb={4}>
              {user.skills.map((skill) => (
                <Chip key={skill} label={skill} color="primary" variant="outlined" />
              ))}
            </Stack>

            {/* Professional Experience */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <WorkOutlineIcon color="primary" />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Professional Experience
              </Typography>
            </Stack>
            <Stack spacing={3} mb={4}>
              {user.professional.map((exp, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2,  }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.role} @ {exp.company}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {exp.duration}
                  </Typography>
                  <List dense>
                    {exp.responsibilities.map((item, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemText primary={`• ${item}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Stack>

            {/* Education */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <SchoolIcon color="primary" />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Education
              </Typography>
            </Stack>
            <Stack spacing={2} mb={4}>
              {user.education.map((edu, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2,  }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {edu.institution}, {edu.year}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* Certifications */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <VerifiedIcon color="primary" />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Certifications
              </Typography>
            </Stack>
            <List dense sx={{ mb: 4 }}>
              {user.certifications.map((cert, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemText primary={`• ${cert}`} />
                </ListItem>
              ))}
            </List>

            {/* Languages */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <LanguageIcon color="primary" />
              <Typography variant="h5" color="primary" fontWeight="medium">
                Languages
              </Typography>
            </Stack>
            <Stack spacing={1}>
              {user.languages.map((lang) => (
                <Typography key={lang} variant="body1">
                  • {lang}
                </Typography>
              ))}
            </Stack>

          </CardContent>
        </Card>
      </Box>
    </AppTheme>
  );
}
