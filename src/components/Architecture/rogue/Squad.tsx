import React, { useState } from 'react';

interface Unit {
  id: string;
  name: string;
  type: string;
  rarity: number; // 1-3 stars
  isSelected: boolean;
  squadId?: string; // Which squad this unit belongs to
}

interface Squad {
  id: string;
  name: string;
  units: Unit[];
  maxSize: number;
  leader?: Unit; // Highest rarity unit becomes leader
}

const Squad: React.FC = () => {
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([
    { id: '1', name: '绿色史莱姆', type: 'slime', rarity: 1, isSelected: false },
    { id: '2', name: '红色史莱姆', type: 'slime', rarity: 1, isSelected: false },
    { id: '3', name: '蓝色史莱姆', type: 'slime', rarity: 1, isSelected: false },
    { id: '4', name: '黄色史莱姆', type: 'slime', rarity: 1, isSelected: false },
    { id: '5', name: 'MIO', type: 'hero', rarity: 3, isSelected: false },
    { id: '6', name: '露库希安', type: 'hero', rarity: 3, isSelected: false }
  ]);

  const [squads, setSquads] = useState<Squad[]>([
    { id: 'squad-1', name: '小队 1', units: [], maxSize: 7 },
    { id: 'squad-2', name: '小队 2', units: [], maxSize: 7 },
    { id: 'squad-3', name: '小队 3', units: [], maxSize: 7 },
    { id: 'squad-4', name: '小队 4', units: [], maxSize: 7 }
  ]);

  const [activeSquadId, setActiveSquadId] = useState<string | null>(null);

  const updateSquadLeader = (squad: Squad) => {
    if (squad.units.length === 0) return { ...squad, leader: undefined };
    const leader = squad.units.reduce((highest, current) => 
      current.rarity > highest.rarity ? current : highest
    );
    return { ...squad, leader };
  };

  const handleUnitSelect = (unitId: string) => {
    const unit = availableUnits.find(u => u.id === unitId);
    if (!unit) return;

    if (unit.isSelected) {
      // Remove from squad
      const squadId = unit.squadId;
      if (squadId) {
        setSquads(prev => prev.map(squad => {
          if (squad.id === squadId) {
            const updatedSquad = {
              ...squad,
              units: squad.units.filter(u => u.id !== unitId)
            };
            return updateSquadLeader(updatedSquad);
          }
          return squad;
        }));
        setAvailableUnits(prev => 
          prev.map(u => u.id === unitId ? { ...u, isSelected: false, squadId: undefined } : u)
        );
      }
    } else {
      // Add to active squad if one is selected
      if (activeSquadId) {
        const activeSquad = squads.find(s => s.id === activeSquadId);
        if (activeSquad && activeSquad.units.length < activeSquad.maxSize) {
          setSquads(prev => prev.map(squad => {
            if (squad.id === activeSquadId) {
              const updatedSquad = {
                ...squad,
                units: [...squad.units, { ...unit, isSelected: true, squadId: activeSquadId }]
              };
              return updateSquadLeader(updatedSquad);
            }
            return squad;
          }));
          
          setAvailableUnits(prev => 
            prev.map(u => u.id === unitId ? { ...u, isSelected: true, squadId: activeSquadId } : u)
          );
        }
      }
    }
  };

  const handleSquadClick = (squadId: string) => {
    setActiveSquadId(squadId);
  };

  const handleDismissSquad = (squadId: string) => {
    // Remove all units from this squad
    setSquads(prev => prev.map(squad => {
      if (squad.id === squadId) {
        return { ...squad, units: [], leader: undefined };
      }
      return squad;
    }));
    
    // Reset all units that were in this squad
    setAvailableUnits(prev => 
      prev.map(u => u.squadId === squadId ? { ...u, isSelected: false, squadId: undefined } : u)
    );
  };

  const activeSquad = activeSquadId ? squads.find(s => s.id === activeSquadId) : null;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#4ecdc4', margin: 0 }}>小队编制与组成</h2>
        {activeSquad && (
          <div style={{
            backgroundColor: '#4ecdc4',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            当前小队: {activeSquad.name} ({activeSquad.units.length}/{activeSquad.maxSize})
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: '20px',
        height: 'calc(100% - 80px)'
      }}>
        {/* Available Units */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>待命区域</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '10px'
          }}>
            {availableUnits.map(unit => (
              <button
                key={unit.id}
                onClick={() => handleUnitSelect(unit.id)}
                style={{
                  padding: '12px 8px',
                  backgroundColor: unit.isSelected ? '#4ecdc4' : '#f8f9fa',
                  color: unit.isSelected ? 'white' : '#333',
                  border: `2px solid ${unit.isSelected ? '#4ecdc4' : '#ddd'}`,
                  borderRadius: '8px',
                  cursor: activeSquadId && !unit.isSelected ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  opacity: activeSquadId && !unit.isSelected ? '1' : '0.7'
                }}
                                  onMouseOver={(e) => {
                    if (activeSquadId && !unit.isSelected) {
                      e.currentTarget.style.backgroundColor = '#e9ecef';
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeSquadId && !unit.isSelected) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>
                  {unit.name}
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  {'⭐'.repeat(unit.rarity)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* All Squads */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>小队列表</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px'
          }}>
            {squads.map(squad => (
              <div
                key={squad.id}
                onClick={() => handleSquadClick(squad.id)}
                style={{
                  border: `3px solid ${activeSquadId === squad.id ? '#4ecdc4' : '#e9ecef'}`,
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: activeSquadId === squad.id ? '#f0f9ff' : '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (activeSquadId !== squad.id) {
                    e.currentTarget.style.backgroundColor = '#e6f3ff';
                    e.currentTarget.style.borderColor = '#45b7aa';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeSquadId !== squad.id) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.borderColor = '#e9ecef';
                  }
                }}
              >
                {activeSquadId === squad.id && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#4ecdc4',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    当前选中
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h4 style={{ color: '#333', margin: 0, fontSize: '14px' }}>
                    {squad.name}
                    {squad.leader && (
                      <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                        队长: {squad.leader.name}
                      </span>
                    )}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ 
                      color: '#666', 
                      fontSize: '12px'
                    }}>
                      {squad.units.length}/{squad.maxSize}
                    </span>
                    {squad.units.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismissSquad(squad.id);
                        }}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                      >
                        解散
                      </button>
                    )}
                  </div>
                </div>
                
                {squad.units.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80px',
                    color: '#999',
                    fontSize: '12px',
                    border: '2px dashed #ddd',
                    borderRadius: '6px',
                    backgroundColor: 'white'
                  }}>
                    空小队
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                    gap: '8px'
                  }}>
                    {squad.units.map((unit: Unit) => (
                      <div
                        key={unit.id}
                        style={{
                          padding: '8px 6px',
                          backgroundColor: unit.id === squad.leader?.id ? '#ffd700' : '#4ecdc4',
                          color: 'white',
                          border: `2px solid ${unit.id === squad.leader?.id ? '#ffd700' : '#4ecdc4'}`,
                          borderRadius: '6px',
                          textAlign: 'center',
                          position: 'relative',
                          fontSize: '10px'
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnitSelect(unit.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                        <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>
                          {unit.name}
                        </div>
                        <div style={{ fontSize: '8px', opacity: 0.8 }}>
                          {'⭐'.repeat(unit.rarity)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Squad Tactics */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>小队战术</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#999',
            fontSize: '16px',
            border: '2px dashed #ddd',
            borderRadius: '8px'
          }}>
            战术配置区域
            <br />
            (开发中...)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squad; 