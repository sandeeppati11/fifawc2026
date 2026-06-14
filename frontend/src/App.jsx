import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Onboarding from './screens/Onboarding';
import GroupStage from './screens/GroupStage';
import Wildcard from './screens/Wildcard';
import KnockoutStage from './screens/KnockoutStage';
import Summary from './screens/Summary';
import Community from './screens/Community';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * App Root Component
 * Coordinates the global user prediction flow:
 * Onboarding -> GroupStage -> Wildcard Selection -> KnockoutBracket -> Summary
 */
export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [prevScreen, setPrevScreen] = useState('onboarding');
  
  const [name, setName] = useState('');
  const [groupRankings, setGroupRankings] = useState([]);
  const [thirdPlaceTeams, setThirdPlaceTeams] = useState([]);
  const [wildcardPicks, setWildcardPicks] = useState([]);
  const [knockoutBracket, setKnockoutBracket] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');

  // Onboarding Start
  const handleStartOnboarding = (userName) => {
    setName(userName);
    setScreen('groupstage');
  };

  // Group Stage Selection Complete
  const handleConfirmGroups = (rankings, wildcards) => {
    setGroupRankings(rankings);
    setThirdPlaceTeams(wildcards);
    setScreen('wildcard');
  };

  // Wildcard Selection Complete
  const handleConfirmWildcards = (picks) => {
    setWildcardPicks(picks);
    setScreen('knockout');
  };

  // Knockout Bracket Selections Complete
  const handleConfirmKnockout = (bracket) => {
    setKnockoutBracket(bracket);
    setScreen('summary');
    setSaveStatus('saving');

    const savePrediction = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/predictions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            groupStage: groupRankings,
            wildcardPicks: wildcardPicks,
            knockoutBracket: bracket,
          }),
        });

        if (response.ok) {
          setSaveStatus('saved');
        } else {
          const errData = await response.json();
          console.error('Save failed:', errData);
          setSaveStatus('error');
        }
      } catch (err) {
        console.error('Error saving bracket:', err);
        setSaveStatus('error');
      }
    };

    savePrediction();
  };

  // View Global Community Statistics Dashboard
  const handleViewCommunity = () => {
    setPrevScreen(screen);
    setScreen('community');
  };

  // Back navigation from community view
  const handleBackFromCommunity = () => {
    setScreen(prevScreen);
  };

  // Restart prediction system
  const handleReset = () => {
    setName('');
    setGroupRankings([]);
    setThirdPlaceTeams([]);
    setWildcardPicks([]);
    setKnockoutBracket(null);
    setSaveStatus('idle');
    setScreen('onboarding');
  };

  // Navbar home-button actions
  const handleBrandClick = () => {
    if (screen === 'community') {
      handleBackFromCommunity();
    } else {
      const confirmRestart = window.confirm("Return to home screen? This will reset all your current prediction progress.");
      if (confirmRestart) {
        handleReset();
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-emerald-950 text-white font-sans overflow-x-hidden">
      {screen !== 'onboarding' && (
        <Navbar
          currentScreen={screen}
          userName={name}
          onViewCommunity={handleViewCommunity}
          onBackToHome={handleBrandClick}
        />
      )}

      <div className="flex-1 w-full flex flex-col justify-start">
        {screen === 'onboarding' && (
          <Onboarding onStart={handleStartOnboarding} initialName={name} />
        )}
        {screen === 'groupstage' && (
          <GroupStage
            onConfirm={handleConfirmGroups}
            onBack={handleReset}
          />
        )}
        {screen === 'wildcard' && (
          <Wildcard
            thirdPlaceTeams={thirdPlaceTeams}
            onConfirm={handleConfirmWildcards}
            onBack={() => setScreen('groupstage')}
          />
        )}
        {screen === 'knockout' && (
          <KnockoutStage
            groupRankings={groupRankings}
            wildcardPicks={wildcardPicks}
            onConfirm={handleConfirmKnockout}
            onBack={() => setScreen('wildcard')}
          />
        )}
        {screen === 'summary' && (
          <Summary
            name={name}
            groupRankings={groupRankings}
            wildcardPicks={wildcardPicks}
            knockoutBracket={knockoutBracket}
            onViewCommunity={handleViewCommunity}
            onReset={handleReset}
            saveStatus={saveStatus}
          />
        )}
        {screen === 'community' && (
          <Community onBack={handleBackFromCommunity} />
        )}
      </div>
    </div>
  );
}
