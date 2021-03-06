import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input, InputGroup, InputGroupAddon, FormFeedback, Button, Spinner } from 'reactstrap';

const UrlForm = ({ value, state, message, onChange, onSubmit }) => {
  const id = 'add-url';
  let btnDisabled = false;
  let inputDisabled = false;
  let valid = false;
  let invalid = false;
  let isSpinnerActive = false;

  switch (state) {
    case 'empty':
      btnDisabled = true;
      break;
    case 'valid':
      valid = true;
      break;
    case 'invalid':
      invalid = true;
      btnDisabled = true;
      break;
    case 'waiting':
      isSpinnerActive = true;
      inputDisabled = true;
      btnDisabled = true;
      break;
    default:
  }

  return (
    <div className="py-4">
      <Label className="display-4 mb-3 ml-1" htmlFor={id}>Add RSS:</Label>
      <InputGroup tag="form" onSubmit={onSubmit}>
        <Input
          valid={valid}
          invalid={invalid}
          value={value}
          onChange={onChange}
          disabled={inputDisabled}
          id={id}
          type="text"
          bsSize="lg"
          name="rss-url"
          placeholder="https://"
        />
        <InputGroupAddon addonType="append">
          <Button color="primary" type="submit" outline disabled={btnDisabled}>
            {isSpinnerActive && <Spinner size="sm" />}
            Add
          </Button>
        </InputGroupAddon>
        <FormFeedback valid={valid}>
          {message}
        </FormFeedback>
      </InputGroup>
    </div>
  );
};

UrlForm.defaultProps = {
  state: 'empty',
  message: '',
};

UrlForm.propTypes = {
  value: PropTypes.string.isRequired,
  state: PropTypes.string,
  message: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UrlForm;
