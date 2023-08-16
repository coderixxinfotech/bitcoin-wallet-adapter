import { render, screen } from "@testing-library/react";
import { ConnectButton } from "../index";
import React from 'react'
it("ConnectButton", () => {
  render(<ConnectButton />);

  const button = screen.getByText(/Connect Wallet/i); // Get the button by its text

  expect(button).toBeTruthy();
});
