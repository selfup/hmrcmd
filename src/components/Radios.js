import { h } from 'hyperapp';

const noRadios = () =>
  <div>
    <h3>You haven't set up any radios.</h3>
    <p>
      Click on Config in the navbar to set up a new radio or import a JSON Config!
    </p>
  </div>;

const renderRadios = (state, actions) => {
  const {
    radios,
  } = state;

  const {
    postIcomCmd,
  } = actions;

  return radios.map((radio, radioIdx) => {
    const {
      tag,
      name,
      commands,
    } = radio;

    return (
      <div class="radio" id={`radio-${radioIdx}`}>
        <h3>{name} ({tag})</h3>
        <hr />
        {
          commands.map((command, cmdIdx) => {
            const {
              name: cmdName,
              port: SerialPort,
              hex: IcomCommand,
            } = command;

            return (
              <button
                id={`cmd-${cmdIdx}`}
                class="btn fire-cmd"
                onclick={() => postIcomCmd({ SerialPort, IcomCommand })}
              >
                {cmdName}
              </button>
            );
          })
        }
      </div>
    );
  });
};

export default (state, actions) => {
  const {
    radios,
  } = state;

  return (
    <div>
      {radios.length ? renderRadios(state, actions) : noRadios()}
    </div>
  );
};
