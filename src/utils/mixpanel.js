// src/utils/mixpanel.js
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Initialize mixpanel
mixpanel.init(MIXPANEL_TOKEN, { debug: process.env.NODE_ENV === 'development' }); 

// Utility functions for tracking
export const Mixpanel = {
  identify: (id) => {
    mixpanel.identify(id);
  },
  
  alias: (id) => {
    mixpanel.alias(id);
  },
  
  track: (name, props) => {
    mixpanel.track(name, props);
  },
  
  people: {
    set: (props) => {
      mixpanel.people.set(props);
    },
  },
  
  events: {
    // Auth Events
    SIGN_IN: 'Sign In',
    SIGN_OUT: 'Sign Out',
    
    // Room Events
    CREATE_ROOM: 'Create Room',
    VIEW_ROOM: 'View Room',
    INVITE_USER: 'Invite User',
    
  }
};