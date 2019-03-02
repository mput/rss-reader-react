import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import sanitizeHtml from 'sanitize-html';

const sanitize = html => sanitizeHtml(html, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
});

const ModalPreview = ({header, body, link, isOpen, toggle}) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>
      {header}
    </ModalHeader>
    <ModalBody dangerouslySetInnerHTML={{ __html: sanitize(body) }} />
    <ModalFooter>
      <Button type="button" color="secondary" onClick={toggle}>Close</Button>
      <a href={link || '#'} role="button" className="btn btn-primary open-link" rel="noopener noreferrer" target="_blank">
        Open link in new window
      </a>
    </ModalFooter>
  </Modal>
);

export default ModalPreview;