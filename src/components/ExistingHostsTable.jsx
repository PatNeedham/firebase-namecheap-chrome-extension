import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const ExistingHostsTable = (props) => {
  const { makingGetHostsRequest, hosts } = props;
  if (makingGetHostsRequest) {
    return (
      <div style={{
        width: '100%',
        height: 100,
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Address</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(hosts || []).filter(h => h.Type === 'A').map(({ HostId, Name, Type, Address, IsActive}, index) => (
          <TableRow key={`${HostId}`}>
            <TableCell component="th" scope="row">
              {Name}
            </TableCell>
            <TableCell component="th" scope="row">
              {Type}
            </TableCell>
            <TableCell component="th" scope="row">
              {Address}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ExistingHostsTable;
