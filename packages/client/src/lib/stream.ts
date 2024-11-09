let stream: MediaStream | undefined;

export const getStream = () => stream;

export const setStream = (_stream?: MediaStream) => {
  stream = _stream;
};

export const destroyStream = () => {
  for (const track of stream?.getTracks() ?? []) track.stop();
  stream = undefined;
};
