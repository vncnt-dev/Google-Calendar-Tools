import React from 'react';
import { Settings, SettingsIsActive } from '../../interfaces/SettingsInterface';
import { settings, saveSettings } from '../lib/SettingsHandler';
import { downloadStringAsFile } from '../lib/miscellaneous';

export const FastActionsModal = () => {
  const closeModal = () => {
    document.getElementById('GCTModal')!.style.display = 'none';
  };

  const handleIcsChange = async (event: any) => {
    console.log('handleIcsChange');
    let files = event.target.files;
    if (!files) return;

    const fileContents = [];
    for (let i = 0; i < files.length; i++) {
      fileContents.push(await files[i].text());
    }

    let combinedIcs = fileContents[0];
    for (let i = 1; i < fileContents.length; i++) {
      let events = fileContents[i].slice(fileContents[i].indexOf('BEGIN:VEVENT'), fileContents[i].lastIndexOf('END:VEVENT') + 11);
      combinedIcs =
        combinedIcs.slice(0, combinedIcs.lastIndexOf('END:VEVENT') + 11) + events + combinedIcs.slice(combinedIcs.lastIndexOf('END:VEVENT') + 11);
    }
    downloadStringAsFile(combinedIcs, 'combined.ics');

    // reset input to no selected file
    event.target.value = '';
  };

  const openSettings = () => {
    chrome.runtime.sendMessage('GCTopenOptionsPage');
  };

  return (
    <div className="modal-content" id="GCToolsMenueBody" style={{ borderRadius: '10px' }}>
      <span className="close" style={{ position: 'relative', top: '-13px' }} onClick={closeModal}>
        &times;
      </span>
      <h2>Toolset for Google Calendar™</h2>
      <h3 className="O1gyfd">Ical Combiner</h3>
      <p>This combines multiple .ics files into one, that then can be imported into Google Calendar™ using the native import functionallity.</p>
      <div className="container" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div className="Trypk" tabIndex={0} role="button" aria-label="Datei von meinem Computer auswählen" style={{ width: '50%' }}>
          <label className="IZXV0b">
            <i className="google-material-icons meh4fc hggPq CJ947" aria-hidden="true">
              file_upload
            </i>
            <span>Select .ics Files</span>
            <input type="file" accept=".ics" multiple className="xBQ53c" name="filename" onChange={handleIcsChange} />
          </label>
        </div>
        <div id="linkToImporter" style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
          <GoogleButtonBlueOutline text="Open Importer" onClick={() => window.open('https://calendar.google.com/calendar/u/0/r/settings/export')} />
        </div>
      </div>
      <h3 className="O1gyfd">Switch Features On/Off</h3>
      <div className="GCToolsMenueItem">
        <div className="GCToolsMenueItem">
          <p>Get more information about the features and additional customization options on the option page.</p>
          <div className="grid grid-cols-2">
            <FastSettingsToggle feature="calcDuration_isActive" name="Display Event-Duration" />
            <FastSettingsToggle feature="hoverInformation_isActive" name="Information On Hover" />
            <FastSettingsToggle feature="betterAddMeeting_isActive" name="Better Add Meeting Buttons" />
            <FastSettingsToggle feature="indicateFullDayEvents_isActive" name="Indicate Full-Day Events" />
          </div>
        </div>
      </div>
      <GoogleButtonBlueOutline text="Open Options Page" onClick={openSettings} />
    </div>
  );
};

const FastSettingsToggle = (props: { feature: keyof SettingsIsActive; name: string }) => {
  const toggleFeature = (feature: keyof SettingsIsActive) => {
    settings[feature] = !settings[feature];
    saveSettings(settings);
  };

  return (
    <div className="block" style={{ marginBottom: '10px' }}>
      <input type="checkbox" id={props.feature} onChange={() => toggleFeature(props.feature)} checked={settings[props.feature]} />
      <label htmlFor={props.feature}>{props.name}</label>
    </div>
  );
};

const GoogleButtonBlueOutline = (props: { text: string; onClick: () => void }) => {
  return (
    <button className="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf" onClick={props.onClick}>
      <span className="VfPpkd-vQzf8d">{props.text}</span>
    </button>
  );
};
