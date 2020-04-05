import { h } from 'hyperapp';

const newCmdForm = (idx, { saveNewCmd, updateNewCmdName, updateNewCmdHex }) => (
  <div>
    <input placeholder="New Command Name" oninput={updateNewCmdName} />
    <input placeholder="New Command HEX" oninput={updateNewCmdHex} />
    <button class="btn save-new-cmd-to-radio" onclick={() => saveNewCmd(idx)}>
      Save New Command
    </button>
  </div>
);

const noRadios = () => (
  <div>
    <h3>You haven't set up any radios.</h3>
    <p>
      Click on Config in the navbar to set up a new radio or import a JSON
      Config!
    </p>
  </div>
);

const renderRadios = (state, actions) => {
  const { displayRadios } = state;

  const { postIcomCmd, addCmd, removeCmd } = actions;

  return displayRadios.map((radio, radioIdx) => {
    const { tag, name, commands, addingNewCmd } = radio;

    return (
      <div class="radio" id={`radio-${radioIdx}`}>
        <p>
          <strong>Name:</strong> {name} | <strong>Tag:</strong> {tag}
        </p>
        <button class="btn add-cmd-to-radio" onclick={() => addCmd(radioIdx)}>
          Add Command
        </button>
        {addingNewCmd ? newCmdForm(radioIdx, actions) : []}
        {commands.map((command, cmdIdx) => {
          const {
            name: cmdName,
            port: SerialPort,
            hex: IcomCommand,
            baud: BaudRate,
          } = command;

          return (
            <div class="radio-cmd">
              <button
                id={`cmd-${cmdIdx}`}
                class="btn fire-cmd"
                onclick={() =>
                  postIcomCmd({
                    SerialPort,
                    IcomCommand,
                    BaudRate,
                  })
                }
              >
                {cmdName}
              </button>
              <button
                class="btn delete-cmd"
                onclick={() => removeCmd({ radioIdx, cmdIdx })}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    );
  });
};

export default (state, actions) => {
  const { radios } = state;

  const { filterDisplayRadiosByTag, filterDisplayRadiosByName } = actions;

  return (
    <div class="radios">
      <input
        placeholder="Search By Tag Name"
        oninput={(e) => filterDisplayRadiosByTag(e.target.value)}
      />
      <input
        placeholder="Search By Radio Name"
        oninput={(e) => filterDisplayRadiosByName(e.target.value)}
      />
      <div class="display-radios">
        {radios.length ? renderRadios(state, actions) : noRadios()}
      </div>
    </div>
  );
};
