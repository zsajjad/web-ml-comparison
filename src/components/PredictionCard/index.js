/**
 *
 * PredictionCard
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function PredictionCard() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

PredictionCard.propTypes = {};

export default PredictionCard;
