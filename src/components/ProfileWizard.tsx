// in some parent component
import  { useState } from 'react';
import ProfileWizardModal from './ProfileWizardModal';
import { Button } from '@mui/material';

export default function ProfileWizard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Edit Profile
      </Button>
      <ProfileWizardModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={data => {
          console.log('Collected profile data:', data);
          // send to your API…
        }}
      />
    </>
  );
}
