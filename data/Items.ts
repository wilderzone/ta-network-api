import { Item } from '../interfaces';

export const Items = {
	// Light Impact Weapons.
	'7422': {
		key: 'Pathfinder_Primary_LightSpinfusor',
		name: 'Light Spinfusor',
		class: 'light',
		type: 'weapon',
		category: 'impact'
	},
	'7425': {
		key: 'Pathfinder_Primary_BoltLauncher',
		name: 'Bolt Launcher',
		class: 'light',
		type: 'weapon',
		category: 'impact'
	},
	'8696': {
		key: 'Pathfinder_Primary_LightSpinfusor_100X',
		name: 'Blinksfusor',
		class: 'light',
		type: 'weapon',
		category: 'impact'
	},
	'8245': {
		key: 'Pathfinder_Primary_LightTwinfusor',
		name: 'Light Twinfusor',
		class: 'light',
		type: 'weapon',
		category: 'impact'
	},
	// Light Timed Weapons.
	'8761': {
		key: 'Light_Primary_LightGrenadeLauncher',
		name: 'Light Grenade Launcher',
		class: 'light',
		type: 'weapon',
		category: 'timed'
	},
	'8252': {
		key: 'Infiltrator_Primary_RemoteArxBuster',
		name: 'Jackal',
		class: 'light',
		type: 'weapon',
		category: 'timed'
	},
	// Light Speciality Weapons.
	'7400': {
		key: 'Sentinel_Primary_SniperRifle',
		name: 'BXT-1',
		class: 'light',
		type: 'weapon',
		category: 'speciality'
	},
	'7395': {
		key: 'Sentinel_Primary_PhaseRifle',
		name: 'Phase Rifle',
		class: 'light',
		type: 'weapon',
		category: 'speciality'
	},
	// Light Bullet Weapons.
	'7438': {
		key: 'Pathfinder_Secondary_LightAssaultRifle',
		name: 'Light Assault Rifle',
		class: 'light',
		type: 'weapon',
		category: 'bullet'
	},
	'7419': {
		key: 'Sentinel_Secondary_Falcon',
		name: 'Falcon',
		class: 'light',
		type: 'weapon',
		category: 'bullet'
	},
	'7433': {
		key: 'Light_Sidearm_Sparrow',
		name: 'Sparrow',
		class: 'light',
		type: 'weapon',
		category: 'bullet'
	},
	'8256': {
		key: 'Infiltrator_Secondary_ThrowingKnives',
		name: 'Throwing Knives',
		class: 'light',
		type: 'weapon',
		category: 'bullet'
	},
	// Light Short-Range Weapons.
	'7399': {
		key: 'Pathfinder_Secondary_Shotgun',
		name: 'Shotgun',
		class: 'light',
		type: 'weapon',
		category: 'short_range'
	},
	'7435': {
		key: 'All_H1_Shocklance',
		name: 'Shocklance',
		class: 'light',
		type: 'weapon',
		category: 'short_range'
	},
	// Light Belt Items.
	'7387': {
		key: 'Pathfinder_Belt_ImpactNitron',
		name: 'Impact Nitron',
		class: 'light',
		type: 'belt',
		category: undefined
	},
	'7437': {
		key: 'Pathfinder_Belt_STGrenade',
		name: 'ST Grenade',
		class: 'light',
		type: 'belt',
		category: undefined
	},
	'7914': {
		key: 'Sentinel_Belt_GrenadeT5',
		name: 'T5 Grenade',
		class: 'light',
		type: 'belt',
		category: undefined
	},
	'7402': {
		key: 'Infiltrator_Belt_StickyGrenade',
		name: 'Sticky Grenade',
		class: 'light',
		type: 'belt',
		category: undefined
	},
	'7421': {
		key: 'Sentinel_Belt_Claymore',
		name: 'Claymore',
		class: 'light',
		type: 'belt',
		category: undefined
	},
	'7440': {
		key: 'Infiltrator_Belt_PrismMines',
		name: 'Prism Mines',
		class: 'light',
		type: 'belt',
		category: undefined
	},
	'8248': {
		key: 'Infiltrator_Belt_NinjaSmoke',
		name: 'Ninja Smoke',
		class: 'light',
		type: 'belt',
		category: undefined
	},
	// Light Packs.
	'7822': {
		key: 'Pathfinder_Pack_JumpPack',
		name: 'Jump Pack',
		class: 'light',
		type: 'pack',
		category: undefined
	},
	'7825': {
		key: 'Pathfinder_Pack_EnergyRecharge',
		name: 'Energy Recharge',
		class: 'light',
		type: 'pack',
		category: undefined
	},
	'7833': {
		key: 'Infiltrator_Pack_Stealth',
		name: 'Stealth',
		class: 'light',
		type: 'pack',
		category: undefined
	},
	'7900': {
		key: 'Sentinel_Pack_EnergyRecharge',
		name: 'Energy Recharge',
		class: 'light',
		type: 'pack',
		category: undefined
	},
	// Light Skins.
	'7834': {
		key: 'Skin_PTH',
		name: 'Pathfinder',
		class: 'light',
		type: 'skin',
		category: undefined
	},
	'7835': {
		key: 'Skin_INF',
		name: 'Infiltrator',
		class: 'light',
		type: 'skin',
		category: undefined
	},
	'8327': {
		key: 'Skin_SEN',
		name: 'Sentinel',
		class: 'light',
		type: 'skin',
		category: undefined
	},
	'8326': {
		key: 'Skin_PTH_Mercenary',
		name: 'Pathfinder Mercenary',
		class: 'light',
		type: 'skin',
		category: undefined
	},
	'8336': {
		key: 'Skin_INF_Mercenary',
		name: 'Infiltrator Mercenary',
		class: 'light',
		type: 'skin',
		category: undefined
	},
	'8337': {
		key: 'Skin_INF_Assassin',
		name: 'Infiltrator Assassin',
		class: 'light',
		type: 'skin',
		category: undefined
	},
	'8665': {
		key: 'Skin_SEN_Mercenary',
		name: 'Sentinel Mercenary',
		class: 'light',
		type: 'skin',
		category: undefined
	},
	// Medium Impact Weapons.
	'7401': {
		key: 'Soldier_Primary_Spinfusor',
		name: 'Spinfusor',
		class: 'medium',
		type: 'weapon',
		category: 'impact'
	},
	'7461': {
		key: 'Technician_Primary_Thumper',
		name: 'Thumper',
		class: 'medium',
		type: 'weapon',
		category: 'impact'
	},
	'8417': {
		key: 'Soldier_Secondary_ThumperD_MKD',
		name: 'Thumper Mk D',
		class: 'medium',
		type: 'weapon',
		category: 'impact'
	},
	'8257': {
		key: 'Soldier_Primary_Twinfusor',
		name: 'Twinfusor',
		class: 'medium',
		type: 'weapon',
		category: 'impact'
	},
	'8697': {
		key: 'Soldier_Primary_Spinfusor_100X',
		name: 'Medium Blinksfusor',
		class: 'medium',
		type: 'weapon',
		category: 'impact'
	},
	// Medium Timed Weapons.
	'7384': {
		key: 'Raider_Primary_ArxBuster',
		name: 'Arx Buster',
		class: 'medium',
		type: 'weapon',
		category: 'timed'
	},
	'7416': {
		key: 'Raider_Primary_GrenadeLauncher',
		name: 'Grenade Launcher',
		class: 'medium',
		type: 'weapon',
		category: 'timed'
	},
	// Medium Speciality Weapons.
	'7436': {
		key: 'Technician_Secondary_RepairToolSD',
		name: 'Advanced Repair Tool',
		class: 'medium',
		type: 'weapon',
		category: 'speciality'
	},
	'8765': {
		key: 'Medium_ElfProjector',
		name: 'Elf Projector',
		class: 'medium',
		type: 'weapon',
		category: 'speciality'
	},
	'8768': {
		key: 'Soldier_Primary_Honorfusor',
		name: 'Honorfusor',
		class: 'medium',
		type: 'weapon',
		category: 'speciality'
	},
	// Medium Bullet Weapons.
	'7385': {
		key: 'Soldier_Primary_AssaultRifle',
		name: 'Assault Rifle',
		class: 'medium',
		type: 'weapon',
		category: 'bullet'
	},
	'7441': {
		key: 'Raider_Secondary_NJ4SMG',
		name: 'NJ4 SMG',
		class: 'medium',
		type: 'weapon',
		category: 'bullet'
	},
	'8249': {
		key: 'Raider_Secondary_NJ5SMG',
		name: 'NJ5 SMG',
		class: 'medium',
		type: 'weapon',
		category: 'bullet'
	},
	'8251': {
		key: 'Raider_Primary_PlasmaGun',
		name: 'Plasma Gun',
		class: 'medium',
		type: 'weapon',
		category: 'bullet'
	},
	'7394': {
		key: 'Medium_Sidearm_NovaBlaster',
		name: 'Nova Blaster',
		class: 'medium',
		type: 'weapon',
		category: 'bullet'
	},
	'7388': {
		key: 'Soldier_Secondary_Eagle',
		name: 'Eagle',
		class: 'medium',
		type: 'weapon',
		category: 'bullet'
	},
	// Medium Short-Range Weapons.
	'7427': {
		key: 'Technician_Secondary_SawedOff',
		name: 'Sawed-Off Shotgun',
		class: 'medium',
		type: 'weapon',
		category: 'short_range'
	},
	'8699': {
		key: 'Technician_Primary_TC24',
		name: 'TC24',
		class: 'medium',
		type: 'weapon',
		category: 'short_range'
	},
	// Medium Belt Items.
	'7444': {
		key: 'Raider_Belt_EMPGrenade',
		name: 'EMP Grenade',
		class: 'medium',
		type: 'belt',
		category: undefined
	},
	'7432': {
		key: 'Raider_Belt_WhiteOut',
		name: 'White-Out Grenade',
		class: 'medium',
		type: 'belt',
		category: undefined
	},
	'8247': {
		key: 'Raider_Belt_MIRVGrenade',
		name: 'MIRV Grenade',
		class: 'medium',
		type: 'belt',
		category: undefined
	},
	'7434': {
		key: 'Soldier_Belt_APGrenade',
		name: 'AP Grenade',
		class: 'medium',
		type: 'belt',
		category: undefined
	},
	'7426': {
		key: 'Technician_Belt_MotionAlarm',
		name: 'Motion Alarm',
		class: 'medium',
		type: 'belt',
		category: undefined
	},
	// Medium Packs.
	'7832': {
		key: 'Raider_Pack_Shield',
		name: 'Shield Pack',
		class: 'medium',
		type: 'pack',
		category: undefined
	},
	'7827': {
		key: 'Raider_Pack_Jammer',
		name: 'Jammer Pack',
		class: 'medium',
		type: 'pack',
		category: undefined
	},
	'8223': {
		key: 'Soldier_Pack_Utility',
		name: 'Utility Pack',
		class: 'medium',
		type: 'pack',
		category: undefined
	},
	'7413': {
		key: 'Technician_Pack_LightTurret',
		name: 'Light Turret',
		class: 'medium',
		type: 'pack',
		category: undefined
	},
	'7417': {
		key: 'Technician_Pack_EXRTurret',
		name: 'EXR Turret',
		class: 'medium',
		type: 'pack',
		category: undefined
	},
	'7456': {
		key: 'Sentinel_Pack_DropJammer',
		name: 'Jammer Pack',
		class: 'medium',
		type: 'pack',
		category: undefined
	},
	// Medium Skins.
	'8328': {
		key: 'Skin_SLD',
		name: 'Soldier',
		class: 'medium',
		type: 'skin',
		category: undefined
	},
	'8330': {
		key: 'Skin_RDR',
		name: 'Raider',
		class: 'medium',
		type: 'skin',
		category: undefined
	},
	'8329': {
		key: 'Skin_TCN',
		name: 'Technician',
		class: 'medium',
		type: 'skin',
		category: undefined
	},
	'8748': {
		key: 'Skin_SLD_Mercenary',
		name: 'Mercenary',
		class: 'medium',
		type: 'skin',
		category: undefined
	},
	'8352': {
		key: 'Skin_RDR_Mercenary',
		name: 'Raider Mercenary',
		class: 'medium',
		type: 'skin',
		category: undefined
	},
	'8731': {
		key: 'Skin_TCN_Mercenary',
		name: 'Technician Mercenary',
		class: 'medium',
		type: 'skin',
		category: undefined
	},
	'8351': {
		key: 'Skin_RDR_Griever',
		name: 'Raider Griever',
		class: 'medium',
		type: 'skin',
		category: undefined
	},
	// Heavy Impact Weapons.
	'7448': {
		key: 'Brute_Primary_HeavySpinfusor',
		name: 'Heavy Spinfusor',
		class: 'heavy',
		type: 'weapon',
		category: 'impact'
	},
	'8414': {
		key: 'Brute_Primary_HeavySpinfusor_MKD',
		name: 'Heavy Spinfusor Mk D',
		class: 'heavy',
		type: 'weapon',
		category: 'impact'
	},
	'7452': {
		key: 'Doombringer_Primary_HeavyBoltLauncher',
		name: 'Heavy Bolt Launcher',
		class: 'heavy',
		type: 'weapon',
		category: 'impact'
	},
	'8656': {
		key: 'Juggernaut_Secondary_HeavyTwinfusor',
		name: 'Heavy Twinfusor',
		class: 'heavy',
		type: 'weapon',
		category: 'impact'
	},
	// Heavy Timed Weapons.
	'7393': {
		key: 'Juggernaut_Primary_FusionMortar',
		name: 'Fusion Mortar',
		class: 'heavy',
		type: 'weapon',
		category: 'timed'
	},
	'7457': {
		key: 'Juggernaut_Primary_MIRVLauncher',
		name: 'MIRV Launcher',
		class: 'heavy',
		type: 'weapon',
		category: 'timed'
	},
	// Heavy Speciality Weapons.
	'7398': {
		key: 'Doombringer_Secondary_SaberLauncher',
		name: 'Saber Launcher',
		class: 'heavy',
		type: 'weapon',
		category: 'speciality'
	},
	'8357': {
		key: 'Brute_Primary_SpikeLauncher',
		name: 'Gladiator',
		class: 'heavy',
		type: 'weapon',
		category: 'speciality'
	},
	// Heavy Bullet Weapons.
	'7386': {
		key: 'Doombringer_Primary_ChainGun',
		name: 'Chain Gun',
		class: 'heavy',
		type: 'weapon',
		category: 'bullet'
	},
	'7458': {
		key: 'Juggernaut_Secondary_X1LMG',
		name: 'X1 LMG',
		class: 'heavy',
		type: 'weapon',
		category: 'bullet'
	},
	'8250': {
		key: 'Brute_Secondary_PlasmaCannon',
		name: 'Plasma Cannon',
		class: 'heavy',
		type: 'weapon',
		category: 'bullet'
	},
	'8403': {
		key: 'Heavy_Sidearm_NovaBlaster_MKD',
		name: 'Nova Blaster Mk D',
		class: 'heavy',
		type: 'weapon',
		category: 'bullet'
	},
	'7431': {
		key: 'Brute_Secondary_NovaColt',
		name: 'Nova Colt',
		class: 'heavy',
		type: 'weapon',
		category: 'bullet'
	},
	// Heavy Short-Range Weapons.
	'7449': {
		key: 'Brute_Secondary_AutoShotgun',
		name: 'Automatic Shotgun',
		class: 'heavy',
		type: 'weapon',
		category: 'short_range'
	},
	'8766': {
		key: 'Elf_FlakCannon',
		name: 'Flak Cannon',
		class: 'heavy',
		type: 'weapon',
		category: 'short_range'
	},
	// Heavy Belt Items.
	'7390': {
		key: 'Doombringer_Belt_FragGrenade',
		name: 'Frag Grenade',
		class: 'heavy',
		type: 'belt',
		category: undefined
	},
	'7428': {
		key: 'Brute_Belt_FractalGrenade',
		name: 'Fractal Grenade',
		class: 'heavy',
		type: 'belt',
		category: undefined
	},
	'7392': {
		key: 'Doombringer_Belt_Mine',
		name: 'Mine',
		class: 'heavy',
		type: 'belt',
		category: undefined
	},
	// Heavy Packs.
	'7826': {
		key: 'Brute_Pack_HeavyShield',
		name: 'Heavy Shield Pack',
		class: 'heavy',
		type: 'pack',
		category: undefined
	},
	'7411': {
		key: 'Doombringer_Pack_ForceField',
		name: 'Force Field',
		class: 'heavy',
		type: 'pack',
		category: undefined
	},
	'8255': {
		key: 'Brute_Pack_SurvivalPack',
		name: 'Survival Pack',
		class: 'heavy',
		type: 'pack',
		category: undefined
	},
	'7830': {
		key: 'Brute_Pack_MinorEnergy',
		name: 'Minor Energy Pack',
		class: 'heavy',
		type: 'pack',
		category: undefined
	},
	// Heavy Skins.
	'8331': {
		key: 'Skin_JUG',
		name: 'Juggernaut',
		class: 'heavy',
		type: 'skin',
		category: undefined
	},
	'8333': {
		key: 'Skin_BRT',
		name: 'Brute',
		class: 'heavy',
		type: 'skin',
		category: undefined
	},
	'8332': {
		key: 'Skin_DMB',
		name: 'Doombringer',
		class: 'heavy',
		type: 'skin',
		category: undefined
	},
	'8745': {
		key: 'Skin_JUG_Mercenary',
		name: 'Juggernaut Mercenary',
		class: 'heavy',
		type: 'skin',
		category: undefined
	},
	'8663': {
		key: 'Skin_BRT_Mercenary',
		name: 'Brute Mercenary',
		class: 'heavy',
		type: 'skin',
		category: undefined
	},
	'8744': {
		key: 'Skin_DMB_Mercenary',
		name: 'Doombringer Mercenary',
		class: 'heavy',
		type: 'skin',
		category: undefined
	},
	// Perks.
	'8162': {
		key: 'Perk_Safe_Fall',
		name: 'Safe Fall',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8163': {
		key: 'Perk_Safety_Third',
		name: 'Safety Third',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'7916': {
		key: 'Perk_Reach',
		name: 'Reach',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8169': {
		key: 'Perk_Wheel_Deal',
		name: 'Wheel Deal',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8153': {
		key: 'Perk_Bounty_Hunter',
		name: 'Bounty Hunter',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8156': {
		key: 'Perk_Close_Combat',
		name: 'Close Combat',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8164': {
		key: 'Perk_Stealthy',
		name: 'Stealthy',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8165': {
		key: 'Perk_Super_Capacitor',
		name: 'Super Capacitor',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8158': {
		key: 'Perk_Looter',
		name: 'Looter',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8232': {
		key: 'Perk_Rage',
		name: 'Rage',
		class: undefined,
		type: 'perk',
		category: 'A'
	},
	'8167': {
		key: 'Perk_Survivalist',
		name: 'Survivalist',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'7917': {
		key: 'Perk_Egocentric',
		name: 'Egocentric',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8159': {
		key: 'Perk_Pilot',
		name: 'Pilot',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8166': {
		key: 'Perk_Super_Heavy',
		name: 'Super Heavy',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8168': {
		key: 'Perk_Ultra_Capacitor',
		name: 'Ultra Capacitor',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8161': {
		key: 'Perk_Quickdraw',
		name: 'Quickdraw',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8170': {
		key: 'Perk_Mechanic',
		name: 'Mechanic',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8157': {
		key: 'Perk_Determination',
		name: 'Determination',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8160': {
		key: 'Perk_Potential_Energy',
		name: 'Potential Energy',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8231': {
		key: 'Perk_Sonic_Punch',
		name: 'Sonic Punch',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	'8646': {
		key: 'Perk_Lightweight',
		name: 'Lightweight',
		class: undefined,
		type: 'perk',
		category: 'B'
	},
	// Voice Packs.
	'8666': {
		key: 'Voice_Light',
		name: 'Light',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8667': {
		key: 'Voice_Medium',
		name: 'Medium',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8668': {
		key: 'Voice_Heavy',
		name: 'Heavy',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8669': {
		key: 'Voice_Dark',
		name: 'Voice_Dark',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8670': {
		key: 'Voice_Fem1',
		name: 'Voice_Fem1',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8671': {
		key: 'Voice_Fem2',
		name: 'Voice_Fem2',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8695': {
		key: 'Voice_Aus',
		name: 'Disker Dundee',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8712': {
		key: 'Voice_T2_Fem01',
		name: 'Voice_T2_Fem01',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8714': {
		key: 'Voice_T2_Fem02',
		name: 'Voice_T2_Fem02',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8715': {
		key: 'Voice_T2_Fem03',
		name: 'Voice_T2_Fem03',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8716': {
		key: 'Voice_T2_Fem04',
		name: 'Voice_T2_Fem04',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8717': {
		key: 'Voice_T2_Fem05',
		name: 'Voice_T2_Fem05',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8719': {
		key: 'Voice_T2_Male01',
		name: 'Voice_T2_Male01',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8720': {
		key: 'Voice_T2_Male02',
		name: 'Voice_T2_Male02',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8721': {
		key: 'Voice_T2_Male03',
		name: 'Voice_T2_Male03',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8722': {
		key: 'Voice_T2_Male04',
		name: 'Voice_T2_Male04',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8723': {
		key: 'Voice_T2_Male05',
		name: 'Voice_T2_Male05',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8724': {
		key: 'Voice_T2_Derm01',
		name: 'Voice_T2_Derm01',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8725': {
		key: 'Voice_T2_Derm02',
		name: 'Voice_T2_Derm02',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8726': {
		key: 'Voice_T2_Derm03',
		name: 'Voice_T2_Derm03',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8747': {
		key: 'Voice_Total_Biscuit',
		name: 'Total Biscuit',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8749': {
		key: 'Voice_Stowaway',
		name: 'Voice_Stowaway',
		class: undefined,
		type: 'voice',
		category: undefined
	},
	'8750': {
		key: 'Voice_Basement_Champion',
		name: 'Voice_Basement_Champion',
		class: undefined,
		type: 'voice',
		category: undefined
	}
} as { [key: string]: Item };

// Item hierarchy, as you would find in the game's menu system.
const hierarchicalDefinitions = {
	'classes': {
		'light': {
			'weapons': {
				'impact': [7422, 7425, 8696, 8245],
				'timed': [8761, 8252],
				'speciality': [7400, 7395],
				'bullet': [7438, 7419, 7433, 8256],
				'short_range': [7399, 7435]
			},
			'belt': [7387, 7437, 7914, 7402, 7421, 7440, 8248],
			'packs': [7822, 7825, 7833, 7900],
			'skins': [7834, 7835, 8327, 8326, 8336, 8337, 8665]
		},
		'medium': {
			'weapons': {
				'impact': [7401, 7461, 8417, 8257, 8697],
				'timed': [7384, 7416],
				'speciality': [7436, 8765, 8768],
				'bullet': [7385, 7441, 8249, 8251, 7394, 7388],
				'short_range': [7427, 8699],
			},
			'belt': [7444, 7432, 8247, 7434, 7426],
			'packs': [7832, 7827, 8223, 7413, 7417, 7456],
			'skins': [8328, 8330, 8329, 8748, 8352, 8731, 8351]
		},
		'heavy': {
			'weapons': {
				'impact': [7448, 8414, 7452, 8656],
				'timed': [7393, 7457],
				'speciality': [7398, 8357],
				'bullet': [7386, 7458, 8250, 8403, 7431],
				'short_range': [7449, 8766],
			},
			'belt': [7390, 7428, 7392],
			'packs': [7826, 7411, 8255, 7830],
			'skins': [8331, 8333, 8332, 8745, 8663, 8744]
		},
	},
	'perks': {
		'A': [8162, 8163, 7916, 8169, 8153, 8156, 8164, 8165, 8158, 8232],
		'B': [8167, 7917, 8159, 8166, 8168, 8161, 8170, 8157, 8160, 8231, 8646]
	},
	'voices': [8666, 8667, 8668, 8669, 8670, 8671, 8695, 8712, 8714, 8715, 8716, 8717, 8719, 8720, 8721, 8722, 8723, 8724, 8725, 8726, 8747, 8749, 8750]
};
