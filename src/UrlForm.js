import React from 'react';
import { Label, Input, InputGroup, InputGroupAddon, FormFeedback, Button, Spinner } from 'reactstrap';

const UrlForm = (props) => {
  return (
    <div className="py-4">
      <Label className="display-4 mb-3 ml-1" for="add-url">Add RSS:</Label>
      <InputGroup>
        <Input invalid bsSize="lg" id="rss-url" type="text" name="rss-url" placeholder="https://" />
        <InputGroupAddon addonType="append">
          <Button color="primary" type="submit" outline={true} disabled={true}>
            <Spinner size="sm"/>
            Add
          </Button>
        </InputGroupAddon>
        <FormFeedback>
          Feedback
        </FormFeedback>
      </InputGroup>
    </div>
  );
}

export default UrlForm;
