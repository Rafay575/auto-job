// src/components/UsersList.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid';

interface ApplicationRow {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  appliedPosition: string;
  fromDate: string;
  toDate: string;
  resumeLink: string;
  status: string;
  package: string;
}

const columns: GridColDef<ApplicationRow>[] = [
  {
    field: 'username',
    headerName: 'Username',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'package',
    headerName: 'Package Subscribed',
    flex: 1.2,
    minWidth: 160,
  },
  {
    field: 'fromDate',
    headerName: 'From',
    flex: 1,
    minWidth: 120,
    valueFormatter: ({ value }) =>
      new Date(value as string).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  },
  {
    field: 'toDate',
    headerName: 'To',
    flex: 1,
    minWidth: 120,
    valueFormatter: ({ value }) =>
      new Date(value as string).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  },
  {
    field: 'appliedPosition',
    headerName: 'Position',
    flex: 1.2,
    minWidth: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1.5,
    minWidth: 180,
  },
  {
    field: 'resumeLink',
    headerName: 'Resume',
    flex: 1.3,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams<ApplicationRow>) => (
      <Link href={params.value} target="_blank" underline="hover">
        Download
      </Link>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    minWidth: 120,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ApplicationRow>) => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          alignItems: 'center',
          height: '100%',
        }}
      >
        <IconButton size="small" onClick={() => console.log('Edit', params.row.id)}>
          <EditRoundedIcon fontSize="inherit" />
        </IconButton>
        <IconButton size="small" onClick={() => console.log('Delete', params.row.id)}>
          <DeleteRoundedIcon fontSize="inherit" />
        </IconButton>
      </Box>
    ),
  },
];

const rows: ApplicationRow[] = [
  {
    id: 1,
    username: 'jdoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    appliedPosition: 'Software Engineer',
    fromDate: '2025-07-01',
    toDate: '2025-12-31',
    resumeLink: '/resumes/jdoe_se.pdf',
    status: 'Pending',
    package: 'Premium',
  },
  {
    id: 2,
    username: 'asmith',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    appliedPosition: 'Frontend Developer',
    fromDate: '2025-06-01',
    toDate: '2025-11-30',
    resumeLink: '/resumes/asmith_fd.pdf',
    status: 'Approved',
    package: 'Standard',
  },
  {
    id: 3,
    username: 'bwayne',
    firstName: 'Bruce',
    lastName: 'Wayne',
    email: 'bruce.wayne@example.com',
    appliedPosition: 'UI Designer',
    fromDate: '2025-08-01',
    toDate: '2026-01-31',
    resumeLink: '/resumes/bwayne_ui.pdf',
    status: 'Reviewed',
    package: 'Basic',
  },
];

export default function UsersList() {
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
