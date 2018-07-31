import { h } from 'hyperapp';

const newCmdForm = (idx, {
  saveNewCmd,
  updateNewCmdName,
  updateNewCmdHex,
}) =>
  <div>
    <input
      placeholder="New Command Name"
      oninput={updateNewCmdName}
    />
    <input
      placeholder="New Command HEX"
      oninput={updateNewCmdHex}
    />
    <p>
      <button
        class="btn save-new-cmd-to-radio"
        onclick={() => saveNewCmd(idx)}
      >
        Save New Command
      </button>
    </p>
  </div>;

const noRadios = () =>
  <div>
    <h3>You haven't set up any radios.</h3>
    <p>
      Click on Config in the navbar to set up a new radio or import a JSON Config!
    </p>
  </div>;

const renderRadios = (state, actions) => {
  const {
    displayRadios,
  } = state;

  const {
    postIcomCmd,
    addCmd,
  } = actions;

  return displayRadios.map((radio, radioIdx) => {
    const {
      tag,
      name,
      commands,
      addingNewCmd,
    } = radio;

    return (
      <div class="radio" id={`radio-${radioIdx}`}>
        <h3>{name} ({tag})</h3>
        <button class="add-cmd-to-radio" onclick={() => addCmd(radioIdx)}>+</button>
        {addingNewCmd ? newCmdForm(radioIdx, actions) : []}
        {
          commands.map((command, cmdIdx) => {
            const {
              name: cmdName,
              port: SerialPort,
              hex: IcomCommand,
            } = command;

            return (
              <div class="radio-cmd">
                <button
                  id={`cmd-${cmdIdx}`}
                  class="btn fire-cmd"
                  onclick={() => postIcomCmd({ SerialPort, IcomCommand })}
                >
                  {cmdName}
                </button>
                <button class="delete-cmd">x</button>
              </div>
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

  const {
    filterDisplayRadiosByTag,
    filterDisplayRadiosByName,
  } = actions;

  return (
    <div>
      <p>
        <input
          placeholder="Search By Tag Name"
          oninput={e => filterDisplayRadiosByTag(e.target.value)}
        />
      </p>
      <p>
        <input
          placeholder="Search By Radio Name"
          oninput={e => filterDisplayRadiosByName(e.target.value)}
        />
      </p>
      {radios.length ? renderRadios(state, actions) : noRadios()}
    </div>
  );
};
