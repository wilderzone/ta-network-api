interface EnumField {
	length: number | 'Sized' | 'EnumBlockArray'| 'ArrayOfEnumBlockArrays',
	type?: 'Boolean' | 'StringBoolean' | 'IntegerBoolean' | 'Integer' | 'IP' | 'ItemID' | 'MapID' | 'TeamID' | 'ServerList' | 'String' | 'Version' | 'Region' | 'WatchNowSection' | 'IGMT',
	name?: string | undefined
}

export const generalEnumfields = {
	'03E3': {length: 16, name: 'Salt'},
	'034A': {length: 'Sized', type: 'String', name: 'Player Name'},
	'035B': {length: 'Sized', name: undefined},
	'037C': {length: 'Sized', name: undefined},
	'0437': {length: 'Sized', type: 'String', name: 'String-Valued Menu Option'},
	'045E': {length: 'Sized', name: undefined},
	'0468': {length: 'Sized', name: undefined},
	'0494': {length: 'Sized', type: 'String', name: 'Login Name'},
	'063B': {length: 'Sized', name: undefined},
	'06B8': {length: 'Sized', type: 'String', name: 'Link'}, // Video links for the watch-now menu.
	'06DE': {length: 'Sized', type: 'String', name: 'Clan Tag'},
	'06E9': {length: 'Sized', name: undefined},
	'0705': {length: 'Sized', type: 'String', name: 'Player Name of Kicker'},
	'0013': {length: 'Sized', type: 'StringBoolean', name: undefined},
	'0082': {length: 'Sized', name: undefined},
	'00A2': {length: 'Sized', name: undefined},
	// '00A3': {length: 'Sized', name: undefined}, // The length of this field may be incorrect, needs verification.
	'00A3': {length: 6, name: undefined},
	'00AA': {length: 'Sized', type: 'StringBoolean', name: undefined},
	'00AB': {length: 'Sized', name: undefined},
	'01A6': {length: 'Sized', type: 'StringBoolean', name: undefined},
	'01C4': {length: 'Sized', name: undefined},
	'020C': {length: 'Sized', name: undefined},
	'021A': {length: 'Sized', type: 'String', name: 'Game Mode'},
	'026F': {length: 'Sized', name: 'Purchase Name'},
	'02AF': {length: 'Sized', type: 'StringBoolean', name: undefined},
	'02B1': {length: 'Sized', type: 'String', name: 'Internal Map Name'},
	'02B6': {length: 'Sized', type: 'String', name: 'Map Name'},
	'02E6': {length: 'Sized', type: 'String', name: 'Message Text'},
	'02FE': {length: 'Sized', type: 'String', name: 'Sender Name/Clan Tag to Purchase'},
	'0300': {length: 'Sized', type: 'String', name: 'Map + Gamemode, Server or Region Name'},
	'01A4': {length: 'Sized', type: 'String', name: 'MOTD / Report Text'},
	'0261': {length: 'Sized', name: 'Integer-Valued Menu Option'},
	'0669': {length: 'Sized', type: 'String', name: 'Promotion Code'},
	'0000': {length: 0, name: undefined},
	'0001': {length: 1, name: undefined},
	'01FA': {length: 1, name: undefined},
	'02C9': {length: 1, name: undefined},
	'0318': {length: 1, name: undefined},
	'0326': {length: 1, name: undefined},
	'0442': {length: 1, name: undefined},
	'046B': {length: 1, name: undefined},
	'0574': {length: 1, name: undefined},
	'0592': {length: 1, type: 'Boolean', name: 'Player Vote'},
	'05D6': {length: 1, name: undefined},
	'05E6': {length: 1, name: undefined},
	'0601': {length: 1, name: undefined},
	'063C': {length: 1, name: undefined},
	'0673': {length: 1, name: undefined},
	'069B': {length: 1, type: 'Boolean', name: undefined},
	'069C': {length: 1, type: 'Boolean', name: 'Password Required'},
	'0703': {length: 1, type: 'Boolean', name: 'Official Rules'},
	'0307': {length: 2, name: undefined},
	'053D': {length: 2, name: 'Ping Time'},
	'0600': {length: 2, name: undefined},
	'006E': {length: 3, name: undefined},
	'0019': {length: 4, name: undefined},
	'0073': {length: 4, name: undefined},
	'008B': {length: 4, name: undefined},
	'008D': {length: 4, name: undefined},
	'0095': {length: 4, name: undefined},
	'009D': {length: 4, name: undefined},
	'009E': {length: 4, type: 'IGMT', name: 'Message Type'}, // In-game Message Type.
	'00BA': {length: 4, name: undefined},
	'00BF': {length: 4, name: undefined},
	'00C3': {length: 4, name: undefined},
	'00C6': {length: 4, type: 'Integer', name: 'Weapon Category (1)'},
	'00D4': {length: 4, name: undefined},
	'01A3': {length: 4, name: undefined},
	'01C0': {length: 4, name: undefined},
	'01C1': {length: 4, name: undefined},
	'01C9': {length: 4, name: undefined},
	'01E3': {length: 4, name: undefined},
	'01E8': {length: 4, name: undefined},
	'020B': {length: 4, name: undefined},
	'020D': {length: 4, type: 'Integer', name: 'Player ID (2)'}, // Determined to be a player ID in the context of 011B.
	'0219': {length: 4, name: undefined},
	'021B': {length: 4, name: undefined},
	'021F': {length: 4, name: undefined},
	'0225': {length: 4, name: undefined},
	'0228': {length: 4, name: undefined},
	'0242': {length: 4, name: undefined},
	'0253': {length: 4, name: undefined},
	'0259': {length: 4, name: undefined},
	'025A': {length: 4, name: undefined},
	'025C': {length: 4, name: undefined},
	'025D': {length: 4, name: undefined},
	'025E': {length: 4, name: undefined},
	'025F': {length: 4, name: undefined},
	'0263': {length: 4, type: 'Integer', name: 'Purchase Index'},
	'026D': {length: 4, type: 'ItemID', name: 'Item ID'},
	'0272': {length: 4, name: undefined},
	'0273': {length: 4, type: 'Integer', name: undefined},
	'0296': {length: 4, type: 'Integer', name: 'Player Rank'},
	'0298': {length: 4, type: 'Integer', name: 'Maximum Rank'},
	'0299': {length: 4, type: 'Integer', name: 'Minimum Rank'},
	'02A3': {length: 4, name: undefined},
	'02AB': {length: 4, name: 'Purchase Type (1de=server, 1fc=boosters, 200=name, 221=tag)'},
	'02AC': {length: 4, name: undefined},
	'02B2': {length: 4, type: 'MapID', name: 'Map ID'},
	'02B3': {length: 4, name: undefined},
	'02B5': {length: 4, name: undefined},
	'02B7': {length: 4, name: undefined},
	'02BE': {length: 4, name: undefined},
	'02C4': {length: 4, name: 'Match ID?'},
	'02C7': {length: 4, type: 'Integer', name: 'Server ID'},
	'02D6': {length: 4, type: 'Integer', name: 'Max Number of Players'},
	'02D7': {length: 4, name: undefined},
	'02D8': {length: 4, name: undefined},
	'02DC': {length: 4, name: undefined},
	'02EA': {length: 4, name: undefined},
	'02EC': {length: 4, name: undefined},
	'02ED': {length: 4, name: undefined},
	'02EF': {length: 4, name: undefined},
	'02F4': {length: 4, type: 'Integer', name: 'Remaining Time in Seconds'},
	'02FC': {length: 4, name: 'Std Message ID'},
	'02FF': {length: 4, type: 'Integer', name: undefined},
	'0319': {length: 4, name: undefined},
	'0320': {length: 4, name: undefined},
	'0331': {length: 4, name: undefined},
	'0333': {length: 4, name: undefined},
	'0343': {length: 4, type: 'Integer', name: 'Number of Players'},
	'0344': {length: 4, name: undefined},
	'0345': {length: 4, name: undefined},
	'0346': {length: 4, name: undefined},
	'0347': {length: 4, name: undefined},
	'0348': {length: 4, type: 'Integer', name: 'Player ID'},
	'035A': {length: 4, name: 'Payment Amount'},
	'0363': {length: 4, name: undefined},
	'0369': {length: 4, name: 'Menu Option Identifier'},
	'036B': {length: 4, name: undefined},
	'036C': {length: 4, name: undefined},
	'037F': {length: 4, type: 'Integer', name: 'Weapon Category (2)'},
	'0380': {length: 4, name: undefined},
	'0385': {length: 4, name: undefined},
	'0398': {length: 4, type: 'Integer', name: 'Class ID'}, // Light: 1683 or 101330, Medium: 1693 or 101342, Heavy: 1692 or 101341
	'03A4': {length: 4, name: undefined},
	'03B4': {length: 4, name: undefined},
	'03CE': {length: 4, name: undefined},
	'03E0': {length: 4, name: undefined},
	'03F1': {length: 4, name: undefined},
	'03F5': {length: 4, name: undefined},
	'03FD': {length: 4, name: undefined},
	'041A': {length: 4, name: undefined},
	'042A': {length: 4, name: undefined},
	'042B': {length: 4, name: undefined},
	'042E': {length: 4, name: undefined},
	'042F': {length: 4, name: undefined},
	'0448': {length: 4, type: 'Region', name: 'Region'},
	'0452': {length: 4, type: 'TeamID', name: 'Team ID'},
	'0457': {length: 4, name: undefined},
	'0458': {length: 4, name: undefined},
	'0472': {length: 4, name: undefined},
	'0489': {length: 4, type: 'Integer', name: undefined},
	'049E': {length: 4, type: 'Version', name: 'Version'},
	'04A5': {length: 4, name: undefined},
	'04A6': {length: 4, name: undefined},
	'04A7': {length: 4, name: undefined},
	'04A8': {length: 4, name: undefined},
	'04A9': {length: 4, name: undefined},
	'04AA': {length: 4, name: undefined},
	'04BB': {length: 4, name: undefined},
	'04CB': {length: 4, type: 'Integer', name: 'Player XP'},
	'04D1': {length: 4, name: undefined},
	'04D5': {length: 4, name: undefined},
	'04D9': {length: 4, name: undefined},
	'04FA': {length: 4, type: 'ItemID', name: 'Item ID (2)'},
	'0502': {length: 4, name: undefined},
	'0556': {length: 4, name: undefined},
	'0558': {length: 4, name: undefined},
	'056A': {length: 4, name: undefined},
	'0577': {length: 4, name: undefined},
	'057D': {length: 4, name: undefined},
	'057F': {length: 4, name: undefined},
	'058A': {length: 4, name: undefined},
	'0591': {length: 4, name: undefined},
	'0596': {length: 4, name: undefined},
	'0597': {length: 4, name: undefined},
	'05B8': {length: 4, name: undefined},
	'05CC': {length: 4, name: 'Currency? (0x0645=gold, 0x27f9=xp)'},
	'05CF': {length: 4, name: 'Purchase Seqnr'},
	'05D3': {length: 4, type: 'Integer', name: 'Player Gold'},
	'05DC': {length: 4, type: 'Integer', name: 'Player Rank Progress'},
	'05E9': {length: 4, name: undefined},
	'05EA': {length: 4, name: undefined},
	'05EE': {length: 4, name: undefined},
	'0602': {length: 4, name: undefined},
	'0608': {length: 4, name: undefined},
	'060A': {length: 4, name: undefined},
	'060C': {length: 4, name: undefined},
	'0615': {length: 4, name: undefined},
	'061D': {length: 4, name: undefined},
	'0623': {length: 4, name: undefined},
	'062D': {length: 4, name: undefined},
	'062E': {length: 4, name: undefined},
	'062F': {length: 4, name: undefined},
	'0636': {length: 4, name: undefined},
	'0637': {length: 4, name: undefined},
	'0638': {length: 4, name: undefined},
	'0639': {length: 4, name: undefined},
	'063A': {length: 4, name: undefined},
	'063D': {length: 4, name: undefined},
	'065F': {length: 4, name: undefined},
	'0660': {length: 4, name: undefined},
	'0661': {length: 4, name: undefined},
	'0663': {length: 4, name: undefined},
	'0664': {length: 4, type: 'Version', name: 'Version'}, // Auth version?
	'066A': {length: 4, name: undefined},
	'0671': {length: 4, name: undefined},
	'0672': {length: 4, name: undefined},
	'0674': {length: 4, name: undefined},
	'0675': {length: 4, name: undefined},
	'0676': {length: 4, name: undefined},
	'0677': {length: 4, name: undefined},
	'067F': {length: 4, name: undefined},
	'0680': {length: 4, name: undefined},
	'0683': {length: 4, name: undefined},
	'0684': {length: 4, name: undefined},
	'068C': {length: 4, name: undefined},
	'0698': {length: 4, name: undefined},
	'0699': {length: 4, name: undefined},
	'069D': {length: 4, name: undefined},
	'069E': {length: 4, name: undefined},
	'069F': {length: 4, name: undefined},
	'06B7': {length: 4, type: 'Integer', name: undefined},
	'06B9': {length: 4, type: 'WatchNowSection', name: 'Watch-Now Section'},
	'06BA': {length: 4, type: 'IntegerBoolean', name: 'Featured'},
	'06BD': {length: 4, name: undefined},
	'06BF': {length: 4, type: 'Integer', name: 'Maximum Rank (alt)'},
	'06C0': {length: 4, name: undefined},
	'06C9': {length: 4, name: undefined},
	'06EA': {length: 4, name: undefined},
	'06EE': {length: 4, name: undefined},
	'06F1': {length: 4, name: undefined},
	'06F5': {length: 4, name: undefined},
	'06FA': {length: 4, name: undefined},
	'0701': {length: 4, name: undefined},
	'0704': {length: 4, name: 'Player ID of Kicker'},
	'0008': {length: 8, name: undefined},
	'00B7': {length: 8, name: undefined},
	'01D7': {length: 8, name: undefined},
	'01F5': {length: 8, name: undefined},
	'0246': {length: 8, type: 'IP', name: '9002 Server Address'},
	'024F': {length: 8, type: 'IP', name: 'Game Server Address'},
	'0303': {length: 8, name: undefined},
	'0419': {length: 8, name: undefined},
	'0434': {length: 8, name: undefined},
	'04D4': {length: 8, name: undefined},
	'057E': {length: 8, name: undefined},
	'05E2': {length: 8, name: undefined},
	'05E4': {length: 8, name: undefined},
	'003A': {length: 'EnumBlockArray', name: 'Auth Info Confirmation'},
	'0197': {length: 'EnumBlockArray', name: 'Auth Info'},
	'01BC': {length: 'EnumBlockArray', name: 'Server Info'},
	'00E9': {length: 'ArrayOfEnumBlockArrays', type: 'ServerList', name: 'ServerList'},
	'0014': {length: 'EnumBlockArray', name: 'Class Menu Content'},
	'0033': {length: 'EnumBlockArray', name: undefined},
	'0035': {length: 'EnumBlockArray', name: undefined},
	'003D': {length: 'EnumBlockArray', name: undefined},
	'0041': {length: 'EnumBlockArray', name: undefined},
	'004C': {length: 'EnumBlockArray', name: undefined},
	'006D': {length: 'EnumBlockArray', name: undefined},
	'006F': {length: 'EnumBlockArray', name: undefined},
	'0070': {length: 'EnumBlockArray', name: 'Chat Message'},
	'0085': {length: 'EnumBlockArray', name: undefined},
	'00B0': {length: 'EnumBlockArray', name: undefined},
	'00B1': {length: 'EnumBlockArray', name: 'Server Join Step 1'},
	'00B2': {length: 'EnumBlockArray', name: 'Server Join Step 2'},
	'00B3': {length: 'EnumBlockArray', name: 'Server Disconnect'},
	'00B4': {length: 'EnumBlockArray', name: undefined},
	'00D5': {length: 'EnumBlockArray', name: undefined},
	'00EC': {length: 'EnumBlockArray', name: '/report Command'},
	'00FB': {length: 'EnumBlockArray', name: undefined},
	'010F': {length: 'EnumBlockArray', name: '(something to do with match end)'},
	'011B': {length: 'EnumBlockArray', name: 'Player Online/Join Notification'},
	'011C': {length: 'EnumBlockArray', name: undefined},
	'0145': {length: 'EnumBlockArray', name: undefined},
	'0175': {length: 'EnumBlockArray', name: 'Purchase'},
	'0176': {length: 'EnumBlockArray', name: undefined},
	'0177': {length: 'EnumBlockArray', name: undefined},
	'0182': {length: 'EnumBlockArray', name: undefined},
	'0183': {length: 'EnumBlockArray', name: undefined},
	'018A': {length: 'EnumBlockArray', name: '/sc Command'},
	'018B': {length: 'EnumBlockArray', name: undefined},
	'018C': {length: 'EnumBlockArray', name: '/votekick Command'},
	'019A': {length: 'EnumBlockArray', name: '(something to do with match end)'},
	'01A2': {length: 'EnumBlockArray', name: '(something to do with setting up a custom server)'},
	'01A5': {length: 'EnumBlockArray', name: '(something to do with setting up a custom server)'},
	'01AB': {length: 'EnumBlockArray', name: '(something to do with setting up a custom server)'},
	'01B5': {length: 'EnumBlockArray', name: 'Watch-Now Menu Content'},
	'01C6': {length: 'EnumBlockArray', name: 'Game Server Info'},
	'01C8': {length: 'EnumBlockArray', name: undefined},
	'00FE': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0116': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0122': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0127': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0132': {length: 'ArrayOfEnumBlockArrays', name: 'Players'}, // Array of individual players in a game server.
	'0138': {length: 'ArrayOfEnumBlockArrays', name: 'Unlockable Items'},
	'0144': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0148': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'05CB': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0632': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0633': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'063E': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0662': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'067E': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'0681': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'068B': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'06BB': {length: 'ArrayOfEnumBlockArrays', name: undefined},
	'06EF': {length: 'ArrayOfEnumBlockArrays', name: undefined},

	// Duplicates remapped:
	'D035': {length: 4, type: 'Integer', name: 'Blood Eagle Score'},
	'D197': {length: 4, type: 'Integer', name: 'Diamond Sword Score'}
} as { [key: string]: EnumField };

const duplicates = {
	'006D': {length: 4, name: undefined},
	'006F': {length: 1, name: undefined},
	'01BC': {length: 'Sized', name: undefined},
	'01A4': {length: 'EnumBlockArray', name: '(something to do with setting up a custom server)'},
};
