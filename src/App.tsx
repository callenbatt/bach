import { Component, createSignal } from "solid-js";

import { Button, Modal, HStack } from "@hope-ui/core";

const App: Component = () => {
  const [isOpen, setIsOpen] = createSignal(true);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} size="full">
        <Modal.Overlay />
        <Modal.Content p={4}>
          <HStack justifyContent="space-between" mb={4}>
            <Modal.Heading fontWeight="semibold">Title</Modal.Heading>
            <Modal.CloseButton />
          </HStack>
          <p>The content of the Modal.</p>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default App;
