import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Use bare stub factories (not automock) so Jest never loads the real
// jsPDF/html2canvas modules — jsPDF's Node build pulls in `fast-png`,
// which needs `TextEncoder`, not present in this jsdom test environment.
jest.mock('jspdf', () => jest.fn());
jest.mock('html2canvas', () => jest.fn());

// CRA's Jest preset sets `resetMocks: true`, which clears any mock
// implementation before every test — so it must be (re)installed here
// rather than inside the jest.mock() factory above.
beforeEach(() => {
  const pdfInstance = { addPage: jest.fn(), addImage: jest.fn(), save: jest.fn() };
  jsPDF.mockImplementation(() => pdfInstance);
  html2canvas.mockResolvedValue({ toDataURL: () => 'data:image/jpeg;base64,fake' });
  global.fetch = jest.fn();
});

test('compiles exactly one PDF page per storybook page and downloads it', async () => {
  const storybook = [
    { text: 'Page 1 text', imageUrl: 'data:image/png;base64,aaa' },
    { text: 'Page 2 text', imageUrl: 'data:image/png;base64,bbb' },
    { text: 'Page 3 text', imageUrl: 'data:image/png;base64,ccc' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true, storybook }),
  });

  render(<App />);

  fireEvent.change(screen.getByPlaceholderText(/lost robot/i), {
    target: { value: 'a test prompt' },
  });
  fireEvent.click(screen.getByText(/create storybook/i));

  await waitFor(() => expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument(), {
    timeout: 3000,
  });

  fireEvent.click(screen.getByTitle('Download PDF'));

  await waitFor(() => expect(jsPDF).toHaveBeenCalledTimes(1), { timeout: 3000 });

  const instance = jsPDF.mock.results[0].value;

  await waitFor(() => expect(instance.save).toHaveBeenCalledWith('my-storybook.pdf'), {
    timeout: 3000,
  });

  expect(instance.addImage).toHaveBeenCalledTimes(storybook.length);
  expect(instance.addPage).toHaveBeenCalledTimes(storybook.length - 1);
});
