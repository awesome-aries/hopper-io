import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import {sizing} from '@material-ui/system';

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(0),
    // marginTop: 'auto',
    // marginTop: 'auto',
    // padding: '0px 0px 0px 0px'
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    bottom: '0',
    left: '0'
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0'
  },
  listItemIcon: {
    minWidth: '30px',
    padding: '0'
  },
  listItem: {
    // paddingBottom: '0px',
    // paddingInline: '0px',
    // paddingTop: '0px'
    padding: '0px 0px 0px 0px'
  },
  listItemText: {
    padding: '0px 0px 0px 0px'
  },
  list: {
    paddingBottom: '0px',
    paddingInline: '0px',
    paddingTop: '0px',
    paddingInlineStart: '0px'
  }
}));

const Footer = props => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg" sizing>
        <div className={classes.linkContainer}>
          <List subheader={<ListSubheader>Allison Geismar</ListSubheader>}>
            <ListItem component="a" href="https://github.com/ageismar">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-github" />
              </ListItemIcon>
              <ListItemText secondary="ageismar" />
            </ListItem>
            <ListItem
              component="a"
              href="https://www.linkedin.com/in/allison-geismar/"
            >
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-linkedin-in" />
              </ListItemIcon>
              <ListItemText secondary="allison-geismar" />
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
            <ListItem component="a" href="https://github.com/KatieGuest">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-github" />
              </ListItemIcon>
              <ListItemText secondary="KatieGuest" />
            </ListItem>
            <ListItem
              component="a"
              href="https://www.linkedin.com/in/katieguest11/"
            >
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-linkedin-in" />
              </ListItemIcon>
              <ListItemText secondary="katieguest11" />
            </ListItem>
          </List>
          <List subheader={<ListSubheader>Nida Jabbar</ListSubheader>}>
            <ListItem component="a" href="https://github.com/nj2296">
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-github" />
              </ListItemIcon>
              <ListItemText secondary="nj2296" />
            </ListItem>
            <ListItem
              component="a"
              href="https://www.linkedin.com/in/nidajabbar/"
            >
              <ListItemIcon className={classes.listItemIcon}>
                <i className="fab fa-linkedin-in" />
              </ListItemIcon>
              <ListItemText secondary="nidajabbar" />
            </ListItem>
          </List>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
