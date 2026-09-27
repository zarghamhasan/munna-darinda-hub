/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ================================================================================
 *   ADMIN & FOUNDER    : HARSHVARDHAN 
 *   WEBSITE DEVELOPER  : ZARGHAM HASAN
 *   Project: Munna Darinda Team — Patna Law College Official Hub (BBA.LLB)
 *   Developer Email: zarghamhasan72@gmail.com
 * ================================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  AuthSession,
  CrewMember,
  Notice,
  Confession,
  StudyResource,
  OfficialLink,
  VotingPoll,
  ExcelCensusData,
  SlideItem,
  DualLogos,
} from './types';
import {
  INITIAL_CREW,
  INITIAL_NOTICES,
  INITIAL_CONFESSIONS,
  INITIAL_STUDY_RESOURCES,
  INITIAL_OFFICIAL_LINKS,
  INITIAL_POLLS,
  INITIAL_SLIDES,
  DEFAULT_LOGOS,
} from './data/initialData';
import { GatekeeperModal } from './components/GatekeeperModal';
import { AdminBar } from './components/AdminBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SlideshowSection } from './components/SlideshowSection';
import { MemberCounterSection } from './components/MemberCounterSection';
import { CrewSection } from './components/CrewSection';
import { VotingSection } from './components/VotingSection';
import { NoticeBoardSection } from './components/NoticeBoardSection';
import { ConfessionsSection } from './components/ConfessionsSection';
import { StudyVaultSection } from './components/StudyVaultSection';
import { AttendanceCalculator } from './components/AttendanceCalculator';
import { OfficialLinksSection } from './components/OfficialLinksSection';
import { CampusLocationSection } from './components/CampusLocationSection';
import { Footer } from './components/Footer';
import { CrewModal, NoticeModal, LinkModal, LogoModal } from './components/AdminModals';
import { SlideModal } from './components/SlideModal';
import { ExcelCounterModal } from './components/ExcelCounterModal';
import { RemoveCrewModal } from './components/RemoveCrewModal';
import { DevPasswordModal } from './components/DevPasswordModal';
import { VisualEditDock } from './components/VisualEditDock';
import { VisualContent, getVisualContent, saveVisualContent, resetVisualContent } from './utils/visualContent';
import { getCensusData, saveCensusData } from './utils/censusUtils';

export default function App() {
  // Authentication session
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_auth_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [gatekeeperOpen, setGatekeeperOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_auth_v1');
      return !saved;
    } catch {
      return true;
    }
  });

  // Data states with persistence
  const [crew, setCrew] = useState<CrewMember[]>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_crew_v6');
      if (saved) return JSON.parse(saved);
      return INITIAL_CREW;
    } catch {
      return INITIAL_CREW;
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_notices_v1');
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  const [confessions, setConfessions] = useState<Confession[]>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_confessions_v1');
      return saved ? JSON.parse(saved) : INITIAL_CONFESSIONS;
    } catch {
      return INITIAL_CONFESSIONS;
    }
  });

  const [resources, setResources] = useState<StudyResource[]>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_resources_v1');
      return saved ? JSON.parse(saved) : INITIAL_STUDY_RESOURCES;
    } catch {
      return INITIAL_STUDY_RESOURCES;
    }
  });

  const [links, setLinks] = useState<OfficialLink[]>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_links_v1');
      return saved ? JSON.parse(saved) : INITIAL_OFFICIAL_LINKS;
    } catch {
      return INITIAL_OFFICIAL_LINKS;
    }
  });

  const [customLogoUrl, setCustomLogoUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('munna_darinda_logo_v1') || '';
    } catch {
      return '';
    }
  });

  // Dual Logos (Patna Law College Logo + Munna Darinda Team Logo)
  const [logos, setLogos] = useState<DualLogos>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_dual_logos_v1');
      if (saved) return JSON.parse(saved);
      const legacy = localStorage.getItem('munna_darinda_logo_v1');
      return {
        plcLogoUrl: DEFAULT_LOGOS.plcLogoUrl,
        teamLogoUrl: legacy || DEFAULT_LOGOS.teamLogoUrl,
      };
    } catch {
      return DEFAULT_LOGOS;
    }
  });

  const handleSaveLogos = (newLogos: DualLogos) => {
    setLogos(newLogos);
    localStorage.setItem('munna_darinda_dual_logos_v1', JSON.stringify(newLogos));
    if (newLogos.teamLogoUrl) {
      setCustomLogoUrl(newLogos.teamLogoUrl);
      localStorage.setItem('munna_darinda_logo_v1', newLogos.teamLogoUrl);
    }
  };

  // Slideshow Gallery state
  const [slides, setSlides] = useState<SlideItem[]>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_slides_v2');
      return saved ? JSON.parse(saved) : INITIAL_SLIDES;
    } catch {
      return INITIAL_SLIDES;
    }
  });

  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);

  const handleSaveSlides = (newSlides: SlideItem[]) => {
    setSlides(newSlides);
    localStorage.setItem('munna_darinda_slides_v2', JSON.stringify(newSlides));
  };

  const handleDeleteSlide = (id: string) => {
    setSlides((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem('munna_darinda_slides_v2', JSON.stringify(updated));
      return updated;
    });
  };

  const [polls, setPolls] = useState<VotingPoll[]>(() => {
    try {
      const saved = localStorage.getItem('munna_darinda_polls_v1');
      return saved ? JSON.parse(saved) : INITIAL_POLLS;
    } catch {
      return INITIAL_POLLS;
    }
  });

  // Admin Modals State
  const [crewModalOpen, setCrewModalOpen] = useState(false);
  const [removeCrewModalOpen, setRemoveCrewModalOpen] = useState(false);
  const [excelCounterOpen, setExcelCounterOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [devPasswordModalOpen, setDevPasswordModalOpen] = useState(false);

  // Official Master Excel Student Headcount Census
  const [census, setCensus] = useState<ExcelCensusData>(() => getCensusData());

  const handleSaveCensus = (newCensus: ExcelCensusData) => {
    const saved = saveCensusData(newCensus);
    setCensus(saved);
  };

  // Live Visual Text Content Editing
  const [visualContent, setVisualContent] = useState<VisualContent>(() => getVisualContent());
  const [isVisualEditMode, setIsVisualEditMode] = useState<boolean>(false);

  const handleUpdateVisualContent = (updated: Partial<VisualContent>) => {
    const result = saveVisualContent(updated);
    setVisualContent(result);
  };

  const handleUpdateVisualTextKey = (key: keyof VisualContent, val: string) => {
    handleUpdateVisualContent({ [key]: val });
  };

  const handleResetVisualContent = () => {
    const defaults = resetVisualContent();
    setVisualContent(defaults);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem('munna_darinda_auth_v1', JSON.stringify(session));
    } else {
      localStorage.removeItem('munna_darinda_auth_v1');
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem('munna_darinda_crew_v6', JSON.stringify(crew));
  }, [crew]);

  useEffect(() => {
    localStorage.setItem('munna_darinda_notices_v1', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('munna_darinda_confessions_v1', JSON.stringify(confessions));
  }, [confessions]);

  useEffect(() => {
    localStorage.setItem('munna_darinda_resources_v1', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('munna_darinda_links_v1', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem('munna_darinda_polls_v1', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('munna_darinda_logo_v1', customLogoUrl);
  }, [customLogoUrl]);

  // Auth Handlers
  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    setGatekeeperOpen(false);
  };

  const handleLogout = () => {
    setSession(null);
    setGatekeeperOpen(true);
  };

  // Crew Handlers
  const handleSaveCrewMember = (savedMember: CrewMember) => {
    setCrew((prev) => {
      const exists = prev.some((m) => m.id === savedMember.id);
      if (exists) {
        return prev.map((m) => (m.id === savedMember.id ? savedMember : m));
      }
      return [savedMember, ...prev];
    });
  };

  const handleDeleteCrewMember = (id: string) => {
    setCrew((prev) => prev.filter((m) => m.id !== id));
  };

  // Notice Handlers
  const handleSaveNotice = (newNotice: Notice) => {
    setNotices((prev) => [newNotice, ...prev]);
  };

  const handleTogglePinNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Confession Handlers
  const handleAddConfession = (newC: Omit<Confession, 'id' | 'likes' | 'timestamp' | 'isApproved'>) => {
    const item: Confession = {
      id: `conf-${Date.now()}`,
      ...newC,
      likes: 1,
      timestamp: 'Just now',
      isApproved: true,
    };
    setConfessions((prev) => [item, ...prev]);
  };

  const handleLikeConfession = (id: string) => {
    setConfessions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const handleDeleteConfession = (id: string) => {
    setConfessions((prev) => prev.filter((c) => c.id !== id));
  };

  // Study Resources Handlers
  const handleAddResource = (res: StudyResource) => {
    setResources((prev) => [res, ...prev]);
  };

  const handleDeleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  // Link Handlers
  const handleSaveLink = (newLink: OfficialLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  // Voting Arena Handlers
  const handleVote = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        const updatedOptions = poll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
        };
      })
    );
  };

  const handleCreatePoll = (newPollData: Omit<VotingPoll, 'id' | 'createdAt' | 'totalVotes'>) => {
    const newPoll: VotingPoll = {
      ...newPollData,
      id: `poll-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalVotes: 0,
    };
    setPolls((prev) => [newPoll, ...prev]);
  };

  const handleDeletePoll = (pollId: string) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId));
  };

  return (
    <div className={`min-h-screen bg-[#080a12] text-[#f8fafc] flex flex-col font-sans ${session?.role === 'admin' ? 'admin-mode' : ''}`}>
      {/* Top Admin Control Deck if admin */}
      <AdminBar
        session={session}
        onLogout={handleLogout}
        onOpenAddCrew={() => {
          setEditingMember(null);
          setCrewModalOpen(true);
        }}
        onOpenAddNotice={() => setNoticeModalOpen(true)}
        onOpenAddLink={() => setLinkModalOpen(true)}
        onToggleLogoModal={() => setLogoModalOpen(true)}
        onOpenExcelCounter={() => setExcelCounterOpen(true)}
        onOpenDevSecurity={() => setDevPasswordModalOpen(true)}
        onToggleVisualEdit={() => setIsVisualEditMode((prev) => !prev)}
        isVisualEditMode={isVisualEditMode}
      />

      {/* Main Navigation Bar */}
      <Header
        session={session}
        onOpenGatekeeper={() => setGatekeeperOpen(true)}
        visualContent={visualContent}
        logos={logos}
        onOpenLogoModal={() => setLogoModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          session={session}
          logos={logos}
          onOpenLogoModal={() => setLogoModalOpen(true)}
          customLogoUrl={customLogoUrl}
          onUpdateLogoUrl={setCustomLogoUrl}
          visualContent={visualContent}
          isEditMode={isVisualEditMode}
          onUpdateText={handleUpdateVisualTextKey}
        />

        {/* Campus Highlights & Slideshow (Admin Editable) */}
        <SlideshowSection
          slides={slides}
          session={session}
          onOpenManageModal={() => {
            setEditingSlide(null);
            setSlideModalOpen(true);
          }}
          onOpenEditSlide={(slide) => {
            setEditingSlide(slide);
            setSlideModalOpen(true);
          }}
          onDeleteSlide={handleDeleteSlide}
        />

        {/* Public Verified Member Counter Section (According to Master Excel) */}
        <MemberCounterSection
          census={census}
          session={session}
          onOpenExcelModal={() => setExcelCounterOpen(true)}
        />

        <CrewSection
          crew={crew}
          session={session}
          onOpenAddModal={() => {
            setEditingMember(null);
            setCrewModalOpen(true);
          }}
          onOpenRemoveModal={() => setRemoveCrewModalOpen(true)}
          onOpenEditModal={(m) => {
            setEditingMember(m);
            setCrewModalOpen(true);
          }}
          onDeleteMember={handleDeleteCrewMember}
        />

        <VotingSection
          polls={polls}
          session={session}
          onVote={handleVote}
          onCreatePoll={handleCreatePoll}
          onDeletePoll={handleDeletePoll}
        />

        <OfficialLinksSection
          links={links}
          session={session}
          onOpenAddModal={() => setLinkModalOpen(true)}
          onDeleteLink={handleDeleteLink}
        />

        <NoticeBoardSection
          notices={notices}
          session={session}
          onOpenAddModal={() => setNoticeModalOpen(true)}
          onTogglePin={handleTogglePinNotice}
          onDeleteNotice={handleDeleteNotice}
        />

        <ConfessionsSection
          confessions={confessions}
          session={session}
          onAddConfession={handleAddConfession}
          onLikeConfession={handleLikeConfession}
          onDeleteConfession={handleDeleteConfession}
        />

        <StudyVaultSection
          resources={resources}
          session={session}
          onAddResource={handleAddResource}
          onDeleteResource={handleDeleteResource}
        />

        <AttendanceCalculator onOpenExcelCounter={session?.role === 'admin' ? () => setExcelCounterOpen(true) : undefined} />

        {/* Visit Us & Google Map (Patna Law College Mahendru) */}
        <CampusLocationSection />
      </main>

      {/* Footer */}
      <Footer visualContent={visualContent} logos={logos} />

      {/* Floating Visual Edit Dock & Live Customizer */}
      <VisualEditDock
        isEditMode={isVisualEditMode}
        onToggleEditMode={() => setIsVisualEditMode((prev) => !prev)}
        content={visualContent}
        onUpdateContent={handleUpdateVisualContent}
        onResetContent={handleResetVisualContent}
        session={session}
      />

      {/* Gatekeeper Authentication Modal */}
      <GatekeeperModal
        isOpen={gatekeeperOpen}
        onClose={() => setGatekeeperOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentSession={session}
        onOpenDevSecurity={() => setDevPasswordModalOpen(true)}
      />

      {/* Admin Modals */}
      <CrewModal
        isOpen={crewModalOpen}
        onClose={() => {
          setCrewModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveCrewMember}
        initialData={editingMember}
      />

      <NoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        onSave={handleSaveNotice}
        currentUsername={session?.username}
      />

      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onSave={handleSaveLink}
      />

      <LogoModal
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
        logos={logos}
        onSaveLogos={handleSaveLogos}
        currentLogoUrl={customLogoUrl}
        onSave={setCustomLogoUrl}
      />

      {/* Slide Modal for Admin Slideshow Management */}
      <SlideModal
        isOpen={slideModalOpen}
        onClose={() => {
          setSlideModalOpen(false);
          setEditingSlide(null);
        }}
        slides={slides}
        onSaveSlides={handleSaveSlides}
        editingSlide={editingSlide}
      />

      {/* Remove Crewmate Modal */}
      <RemoveCrewModal
        isOpen={removeCrewModalOpen}
        onClose={() => setRemoveCrewModalOpen(false)}
        crew={crew}
        onDeleteMember={handleDeleteCrewMember}
      />

      {/* Excel Sheet Student Headcount Counter */}
      <ExcelCounterModal
        isOpen={excelCounterOpen}
        onClose={() => setExcelCounterOpen(false)}
        session={session}
        census={census}
        onSaveCensus={handleSaveCensus}
      />

      {/* Developer Security & Password Console */}
      <DevPasswordModal
        isOpen={devPasswordModalOpen}
        onClose={() => setDevPasswordModalOpen(false)}
        session={session}
        census={census}
        onUpdateCensus={handleSaveCensus}
        onOpenExcelUpload={() => {
          setDevPasswordModalOpen(false);
          setExcelCounterOpen(true);
        }}
        onDevLoginSuccess={(devSession) => {
          handleLoginSuccess(devSession);
          setGatekeeperOpen(false);
        }}
      />
    </div>
  );
}
