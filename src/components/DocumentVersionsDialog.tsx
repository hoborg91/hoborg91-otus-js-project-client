import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
// import { blue } from '@material-ui/core/colors';
import { IDocumentVersionInfo } from '../contracts/document';
import { Description } from '@material-ui/icons';
import { Badge } from '@material-ui/core';
import { Link } from 'react-router-dom';

// const useStyles = makeStyles({
//     avatar: {
//         backgroundColor: blue[100],
//         color: blue[600],
//     },
// });

export interface SimpleDialogProps {
    open: boolean;
    //selectedValue: string;
    onClose: (version: IDocumentVersionInfo | null) => void;
    versions: IDocumentVersionInfo[];
    for?: string;
}

export function DocumentVersionsDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose(null);
    };

    const handleListItemClick = (value: IDocumentVersionInfo) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">
            {props.for}
            <br />
            <small>Other versions of this document are presented below</small>
        </DialogTitle>
        <List>
            {props.versions.map(version => (
            <ListItem button onClick={() => handleListItemClick(version)} key={version.userFriendlyId}>
                <ListItemAvatar>
                    {version.language
                        ? <Badge badgeContent={version.language} color="primary">
                            <Description />
                        </Badge>
                        : <Description />
                    }
                </ListItemAvatar>
                <ListItemText>
                    <Link to={version.userFriendlyId}>
                        {version.caption}
                    </Link>
                </ListItemText>
            </ListItem>
            ))}
        </List>
        </Dialog>
    );
}
