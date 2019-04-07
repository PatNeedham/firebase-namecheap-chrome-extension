import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const ExistingHostsTable = (props) => {
  const { values } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Record type</TableCell>
          <TableCell>Host</TableCell>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {values[0].map((value, index) => (
          <TableRow key={`${value.host}_${index}`}>
            <TableCell component="th" scope="row">
              {value.host.replace(' help_outline', '')}
            </TableCell>
            <TableCell component="th" scope="row">
              {value.recordType}
            </TableCell>
            <TableCell component="th" scope="row">
              {value.value.replace(' content_copy', '')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ExistingHostsTable;
