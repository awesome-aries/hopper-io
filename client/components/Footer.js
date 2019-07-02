import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    backgroundColor: 'white'
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listItemIcon: {
    minWidth: '30px'
  }
}));

const Footer = props => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center">
          Hire Us!
        </Typography>
        <div className={classes.linkContainer}>
          <List subheader={<ListSubheader>Allison Geismar</ListSubheader>}>
            <ListItem component="a" href="https://github.com/">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-github" />
              </ListItemIcon>
              <ListItemText secondary="Github" />
            </ListItem>
            <ListItem component="a" href="https://www.linkedin.com/">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-linkedin-in" />
              </ListItemIcon>
              <ListItemText secondary="LinkedIn" />
            </ListItem>
          </List>
          <List subheader={<ListSubheader>Cara Takemoto</ListSubheader>}>
            <ListItem component="a" href="https://github.com/ctakemoto">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-github" />
              </ListItemIcon>
              <ListItemText secondary="ctakemoto" />
            </ListItem>
            <ListItem
              component="a"
              href="https://www.linkedin.com/in/cara-takemoto/"
            >
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-linkedin-in" />
              </ListItemIcon>
              <ListItemText secondary="cara-takemoto" />
            </ListItem>
          </List>
          <List subheader={<ListSubheader>Katie Guest</ListSubheader>}>
            <ListItem component="a" href="https://github.com/">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-github" />
              </ListItemIcon>
              <ListItemText secondary="Github" />
            </ListItem>
            <ListItem component="a" href="https://www.linkedin.com/">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-linkedin-in" />
              </ListItemIcon>
              <ListItemText secondary="LinkedIn" />
            </ListItem>
          </List>
          <List subheader={<ListSubheader>Nida Jabbar</ListSubheader>}>
            <ListItem component="a" href="https://github.com/">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-github" />
              </ListItemIcon>
              <ListItemText secondary="Github" />
            </ListItem>
            <ListItem component="a" href="https://www.linkedin.com/">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-linkedin-in" />
              </ListItemIcon>
              <ListItemText secondary="LinkedIn" />
            </ListItem>
          </List>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
