import React, { useState } from 'react';
import Squad from './Squad';

interface TutorialSection {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
}

const tutorialSections: TutorialSection[] = [
  {
    id: 'squad-formation',
    title: '第一关 小队编制与组成',
    description: '学习如何组建和管理小队',
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: 'battlefield-deployment',
    title: '第二关 战区部署与撤离',
    description: '掌握战区部署和撤离技巧',
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: 'combat-system',
    title: '第三关 战斗系统与阵型',
    description: '了解战斗系统和阵型运用',
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: 'commander-system',
    title: '第四关 前线指挥与撤离',
    description: '学习指挥官部署和撤离',
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: 'emergency-combat',
    title: '第五关 紧急作战与回避',
    description: '掌握紧急情况和回避策略',
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: 'route-planning',
    title: '第六关 路线安排与规划',
    description: '学习路线规划和节点选择',
    isUnlocked: true,
    isCompleted: false
  },
  {
    id: 'demo-test',
    title: '第七关 教学测试与验收',
    description: '完成教学测试和最终验收',
    isUnlocked: true,
    isCompleted: false
  }
];

const RogueModeTutorial = () => {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const handleSectionSelect = (sectionId: string) => {
        setSelectedSection(sectionId);
        console.log(`Selected tutorial section: ${sectionId}`);
        // TODO: Implement section loading logic
    };

    const handleBackToSelection = () => {
        setSelectedSection(null);
    };

    // If a section is selected, render the appropriate component
    if (selectedSection) {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                position: 'relative'
            }}>
                <button
                    onClick={handleBackToSelection}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#4ecdc4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        zIndex: 1001
                    }}
                >
                    ← 返回
                </button>
                
                {/* Render specific components based on selected section */}
                {selectedSection === 'squad-formation' && <Squad />}
                {selectedSection !== 'squad-formation' && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ color: '#4ecdc4', marginBottom: '20px' }}>
                            {tutorialSections.find(s => s.id === selectedSection)?.title}
                        </h2>
                        <p style={{ color: '#666' }}>
                            此关卡正在开发中...
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            padding: '40px 20px',
            overflowY: 'auto'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: '#4ecdc4',
                    marginBottom: '40px',
                    fontSize: '28px',
                    fontWeight: 'bold'
                }}>
                    教学关卡
                </h1>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '20px'
                }}>
                    {tutorialSections.map((section, index) => (
                        <button
                            key={section.id}
                            onClick={() => handleSectionSelect(section.id)}
                            style={{
                                padding: '20px',
                                backgroundColor: section.isUnlocked ? '#4ecdc4' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: section.isUnlocked ? 'pointer' : 'not-allowed',
                                textAlign: 'left',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseOver={(e) => {
                                if (section.isUnlocked) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (section.isUnlocked) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '10px'
                            }}>
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '15px',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        marginBottom: '5px'
                                    }}>
                                        {section.title}
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        opacity: 0.9
                                    }}>
                                        {section.description}
                                    </div>
                                </div>
                            </div>
                            
                            {section.isCompleted && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2ecc71',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    color: 'white'
                                }}>
                                    ✓
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default RogueModeTutorial;