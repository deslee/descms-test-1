import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import './all.sass';

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet title="Home | Gatsby + Netlify CMS" />
    the layout (header, footer, etc) is here.
    <div>{children()}</div>
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
