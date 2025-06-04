const output = document.getElementById('output');
const input = document.getElementById('commandInput');
const suggestionText = document.getElementById('inlineSuggestion');

const startTime = Date.now();
let commandInProgress = false;
let commandHistory = [];
let historyIndex = -1;

const files = {
    'about.txt': `Hi, hello! I'm twigform

I'm a guy on the internet, and I like making:
├── Cool websites!
├── Cool music (mashcore mostly)!
├── Cool games!
└── Cool apps!

I also really like pallas cats... :)`,
    
    'skills.md': `# Skills

## Stuff I'm OK At:

### Frontend
- HTML, CSS, Svelte

### Backend  
- Typescript, Python, APIs

### Design
- UI/UX, Animation, Graphic

### Music
- Breakcore, Mashcore, IDM

### Games
- GameMaker Studio, Godot`,

    'projects/README.md': `# Current Projects

- **Portfolio Website** (You're here!)
- **Music Stuff** Patchform on Soundcloud :)
- **BaoBox** Simple kanban board app!
- **Game Development** Some GameMaker stuff (RPG)`,

    'social_links/links.txt': `Social Links:

Twitter: https://x.com/twiiiig_
GitHub: https://github.com/twigform
Bluesky: https://bsky.app/profile/twigform.bsky.social
Discord: [Click the corner icon to reveal]`
};

const commandList = [
    { name: 'help', description: 'Show available commands', type: 'command' },
    { name: 'about', description: 'Learn more about me', type: 'command' },
    { name: 'skills', description: 'View technical skills', type: 'command' },
    { name: 'projects', description: 'See current projects', type: 'command' },
    { name: 'social', description: 'Show social links', type: 'command' },
    { name: 'meow', description: 'Display ASCII cat', type: 'command' },
    { name: 'palla', description: 'Show random pallas cat GIF', type: 'command' },
    { name: 'cowsay', description: 'Make a cow say something', type: 'command' },    { name: 'lolcat', description: 'Display rainbow colored text', type: 'command' },
    { name: 'accent', description: 'Change accent color theme', type: 'command' },
    { name: 'theme', description: 'Change color scheme (catppuccin/material-you/gruvbox)', type: 'command' },
    { name: 'clear', description: 'Clear terminal', type: 'command' },
    { name: 'whoami', description: 'Display user info', type: 'command' },
    { name: 'date', description: 'Show current date', type: 'command' },
    { name: 'uptime', description: 'Show system uptime', type: 'command' },
    { name: 'ls', description: 'List directory contents', type: 'command' },
    { name: 'pwd', description: 'Print working directory', type: 'command' },
    { name: 'cat', description: 'Display file contents', type: 'command' },
    { name: 'echo', description: 'Display text', type: 'command' }
];

let currentSuggestion = '';

const themes = {
    catppuccin: {
        name: 'Catppuccin',
        colors: {
            rosewater: '#f5e0dc',
            flamingo: '#f2cdcd',
            pink: '#f5c2e7',
            mauve: '#cba6f7',
            red: '#f38ba8',
            maroon: '#eba0ac',
            peach: '#fab387',
            yellow: '#f9e2af',
            green: '#a6e3a1',
            teal: '#94e2d5',
            sky: '#89dceb',
            sapphire: '#74c7ec',
            blue: '#89b4fa',
            lavender: '#b4befe',
            text: '#cdd6f4',
            subtext1: '#bac2de',
            subtext0: '#a6adc8',
            overlay2: '#9399b2',
            overlay1: '#7f849c',
            overlay0: '#6c7086',
            surface2: '#585b70',
            surface1: '#45475a',
            surface0: '#313244',
            base: '#1e1e2e',
            mantle: '#181825',
            crust: '#11111b'
        }
    },
    'material-you': {
        name: 'Material You',
        colors: {
            rosewater: '#ffd7d9',
            flamingo: '#ffb3ba',
            pink: '#ff9ac1',
            mauve: '#bb86fc',
            red: '#f28b82',
            maroon: '#d93025',
            peach: '#fbbc04',
            yellow: '#fdd663',
            green: '#81c995',
            teal: '#12b5cb',
            sky: '#8ab4f8',
            sapphire: '#4285f4',
            blue: '#1a73e8',
            lavender: '#c58af9',
            text: '#e8eaed',
            subtext1: '#bdc1c6',
            subtext0: '#9aa0a6',
            overlay2: '#80868b',
            overlay1: '#5f6368',
            overlay0: '#3c4043',
            surface2: '#303134',
            surface1: '#2d2e30',
            surface0: '#292a2d',
            base: '#1f1f1f',
            mantle: '#1a1a1a',
            crust: '#131314'
        }
    },
    gruvbox: {
        name: 'Gruvbox',
        colors: {
            rosewater: '#d5c4a1',
            flamingo: '#bdae93',
            pink: '#d3869b',
            mauve: '#b16286',
            red: '#fb4934',
            maroon: '#cc241d',
            peach: '#fe8019',
            yellow: '#fabd2f',
            green: '#b8bb26',
            teal: '#8ec07c',
            sky: '#83a598',
            sapphire: '#458588',
            blue: '#458588',
            lavender: '#a89984',
            text: '#ebdbb2',
            subtext1: '#d5c4a1',
            subtext0: '#bdae93',
            overlay2: '#a89984',
            overlay1: '#928374',
            overlay0: '#7c6f64',
            surface2: '#504945',
            surface1: '#3c3836',
            surface0: '#32302f',
            base: '#282828',
            mantle: '#1d2021',
            crust: '#1d2021'
        }
    },
    dracula: {
        name: 'Dracula',
        colors: {
            rosewater: '#f8f8f2',
            flamingo: '#ffb86c',
            pink: '#ff79c6',
            mauve: '#bd93f9',
            red: '#ff5555',
            maroon: '#ff6e6e',
            peach: '#ffb86c',
            yellow: '#f1fa8c',
            green: '#50fa7b',
            teal: '#8be9fd',
            sky: '#8be9fd',
            sapphire: '#6272a4',
            blue: '#bd93f9',
            lavender: '#bd93f9',
            text: '#f8f8f2',
            subtext1: '#f8f8f2',
            subtext0: '#6272a4',
            overlay2: '#6272a4',
            overlay1: '#44475a',
            overlay0: '#44475a',
            surface2: '#44475a',
            surface1: '#44475a',
            surface0: '#282a36',
            base: '#282a36',
            mantle: '#21222c',
            crust: '#191a21'
        }
    }
};

let currentTheme = 'catppuccin';

function initializeTerminal() {
    const initialLines = document.querySelectorAll('.current-line');
    if (initialLines.length > 1) {
        for (let i = 1; i < initialLines.length; i++) {
            initialLines[i].remove();
        }
    }
    
    const currentInput = document.querySelector('.current-line input');
    if (currentInput) {
        currentInput.focus();
    }
}

function getAutocompleteSuggestion(inputValue) {
    const trimmed = inputValue.trim().toLowerCase();
    const parts = trimmed.split(' ');
    const command = parts[0];
    const args = parts.slice(1).join(' ');
    
    if (parts.length === 1) {
        const match = commandList.find(cmd => 
            cmd.name.toLowerCase().startsWith(command) && cmd.name.toLowerCase() !== command
        );
        return match ? match.name : '';
    }
      if (command === 'cat' && parts.length === 2) {
        const fileList = Object.keys(files).map(file => ({
            name: file,
            description: 'File',
            type: 'file'
        }));
        const match = fileList.find(file => 
            file.name.toLowerCase().startsWith(args) && file.name.toLowerCase() !== args
        );
        return match ? match.name : '';
    }
    
    if (command === 'theme' && parts.length === 2) {
        const themeList = ['list', ...Object.keys(themes)].map(theme => ({
            name: theme,
            description: 'Theme',
            type: 'theme'
        }));
        const match = themeList.find(theme => 
            theme.name.toLowerCase().startsWith(args) && theme.name.toLowerCase() !== args
        );
        return match ? match.name : '';
    }
    
    if (command === 'accent' && parts.length === 2) {
        const catppuccinColors = [
            'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 
            'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender', 'list'
        ].map(color => ({
            name: color,
            description: 'Color',
            type: 'color'
        }));
        const match = catppuccinColors.find(color => 
            color.name.toLowerCase().startsWith(args) && color.name.toLowerCase() !== args
        );
        return match ? match.name : '';
    }
    
    return '';
}

function updateSuggestion() {
    const inputValue = input.value;
    const trimmed = inputValue.trim();
    const parts = trimmed.split(' ');
    
    if (!trimmed) {
        suggestionText.innerHTML = '';
        currentSuggestion = '';
        return;
    }
    
    const suggestion = getAutocompleteSuggestion(inputValue);
    currentSuggestion = suggestion;
      if (suggestion) {
        let displayText = '';
        
        if (parts.length === 1) {
            displayText = `<span class="typed-part">${trimmed}</span><span class="suggestion-part">${suggestion.substring(trimmed.length)}</span>`;
        } else if ((parts[0].toLowerCase() === 'cat' || parts[0].toLowerCase() === 'theme' || parts[0].toLowerCase() === 'accent') && parts.length === 2) {
            const args = parts.slice(1).join(' ');
            displayText = `<span class="typed-part">${parts[0]} ${args}</span><span class="suggestion-part">${suggestion.substring(args.length)}</span>`;
        }
        
        suggestionText.innerHTML = displayText;
    } else {
        suggestionText.innerHTML = '';
    }
}

function acceptSuggestion() {
    if (!currentSuggestion) return false;
    
    const inputValue = input.value.trim();
    const parts = inputValue.split(' ');
      if (parts.length === 1) {
        input.value = currentSuggestion;
    } else if ((parts[0].toLowerCase() === 'cat' || parts[0].toLowerCase() === 'theme' || parts[0].toLowerCase() === 'accent') && parts.length === 2) {
        input.value = parts[0] + ' ' + currentSuggestion;
    }
    
    updateSuggestion();    return true;
}

function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
        if (historyIndex === -1) {
            historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
            historyIndex--;
        }
    } else if (direction === 'down') {
        if (historyIndex === -1) {
            return;
        } else if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
        } else {
            historyIndex = -1;
            input.value = '';
            updateSuggestion();
            return;
        }
    }
    
    if (historyIndex >= 0 && historyIndex < commandHistory.length) {
        input.value = commandHistory[historyIndex];
        updateSuggestion();
        setTimeout(() => {
            input.setSelectionRange(input.value.length, input.value.length);
        }, 0);
    }
}

input.addEventListener('input', updateSuggestion);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && currentSuggestion) {
        e.preventDefault();
        acceptSuggestion();
        return;
    } else if (e.key === 'ArrowRight' && currentSuggestion && input.selectionStart === input.value.length) {
        e.preventDefault();
        acceptSuggestion();
        return;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory('up');
        return;
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory('down');
        return;
    }
    
    if (e.key === 'Enter') {
        const cmd = input.value;
        executeCommand(cmd);
        input.value = '';
        updateSuggestion();
    }
});

const commands = {    help: () => `<div class="info">Available commands:</div>
<div class="command-output">
<span class="highlight">about</span>     - Learn more about me<br>
<span class="highlight">skills</span>    - View my technical skills<br>
<span class="highlight">projects</span>  - See my current projects<br>
<span class="highlight">social</span>    - Show social links<br>
<span class="highlight">meow</span>      - Display a random ASCII cat<br>
<span class="highlight">palla</span>     - Show a random pallas cat GIF<br>
<span class="highlight">cowsay</span>    - Make a cow say something<br>
<span class="highlight">lolcat</span>    - Display rainbow colored text<br>
<span class="highlight">accent</span>    - Change accent color (random/list/&lt;color&gt;)<br>
<span class="highlight">theme</span>     - Change color scheme (list/catppuccin/gruvbox/etc)<br>
<span class="highlight">clear</span>     - Clear the terminal<br>
<span class="highlight">whoami</span>    - Display current user<br>
<span class="highlight">date</span>      - Show current date/time<br>
<span class="highlight">uptime</span>    - Show system uptime<br>
<span class="highlight">ls</span>        - List directory contents<br>
<span class="highlight">pwd</span>       - Print working directory<br>
<span class="highlight">cat</span>       - Display file contents<br>
<span class="highlight">echo</span>      - Display a line of text<br>
</div>`,
    
    about: () => `<div class="command-output">
<span class="prompt">❯</span> Hi, hello! I'm <span class="highlight">twigform</span><br>
<span class="prompt">❯</span> I'm a guy on the internet, and I like making:<br>
<br>
<span class="tree-branch">├──</span> <span class="activity">Cool websites!</span><br>
<span class="tree-branch">├──</span> <span class="activity">Cool music (mashcore mostly)!</span><br>
<span class="tree-branch">├──</span> <span class="activity">Cool games!</span><br>
<span class="tree-branch">└──</span> <span class="activity">Cool apps!</span><br>
<br>
<span class="prompt">❯</span> I also really like pallas cats... :)
</div>`,
    
    skills: () => `<div class="command-output">
<span class="info">Stuff I'm OK At:</span><br>
<br>
<span class="tree-branch">├──</span> <span class="highlight">Frontend:</span> <span class="activity">HTML, CSS, Svelte</span><br>
<span class="tree-branch">├──</span> <span class="highlight">Backend:</span> <span class="activity">Typescript, Python, APIs</span><br>
<span class="tree-branch">├──</span> <span class="highlight">Design:</span> <span class="activity">UI/UX, Animation, Graphic</span><br>
<span class="tree-branch">├──</span> <span class="highlight">Music:</span> <span class="activity">Breakcore, Mashcore, IDM</span><br>
<span class="tree-branch">└──</span> <span class="highlight">Games:</span> <span class="activity">GameMaker Studio, Godot</span><br>
</div>`,
    
    projects: () => `<div class="command-output">
<span class="info">Current Projects:</span><br>
<br>
<span class="tree-branch">├──</span> <span class="highlight">Portfolio Website</span> <span class="activity">(You're here!)</span><br>
<span class="tree-branch">├──</span> <span class="highlight">Music Stuff</span> <span class="activity">Patchform on Soundcloud :)</span><br>
<span class="tree-branch">├──</span> <span class="highlight">BaoBox</span> <span class="activity">Simple kanban board app!</span><br>
<span class="tree-branch">└──</span> <span class="highlight">Game Development</span> <span class="activity">Some GameMaker stuff (RPG)</span><br>
</div>`,
    
    social: () => {
        const container = document.querySelector('.corner-svg-container');
        container.click();
        return `<div class="success">Social links activated! Check the bottom right corner ↘</div>`;
    },
    
    clear: () => {
        output.innerHTML = '';
        return '';
    },
    
    whoami: () => {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        
        let browser = 'Unknown';
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
            browser = 'Chrome';
        } else if (userAgent.indexOf('Firefox') > -1) {
            browser = 'Firefox';
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            browser = 'Safari';
        } else if (userAgent.indexOf('Edg') > -1) {
            browser = 'Edge';
        }
        
        let os = 'Unknown';
        if (userAgent.indexOf('Windows') > -1) {
            os = 'Windows';
        } else if (userAgent.indexOf('Mac') > -1) {
            os = 'macOS';
        } else if (userAgent.indexOf('Linux') > -1) {
            os = 'Linux';
        } else if (userAgent.indexOf('Android') > -1) {
            os = 'Android';
        } else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
            os = 'iOS';
        }
        
        return `<div class="command-output">
<span class="info">Current User Information:</span><br>
<br>
<span class="tree-branch">├──</span> <span class="highlight">Username:</span> <span class="activity">guest</span><br>
<span class="tree-branch">├──</span> <span class="highlight">Browser:</span> <span class="activity">${browser}</span><br>
<span class="tree-branch">├──</span> <span class="highlight">Operating System:</span> <span class="activity">${os}</span><br>
<span class="tree-branch">├──</span> <span class="highlight">Platform:</span> <span class="activity">${platform}</span><br>
<span class="tree-branch">├──</span> <span class="highlight">Language:</span> <span class="activity">${language}</span><br>
<span class="tree-branch">└──</span> <span class="highlight">Screen Resolution:</span> <span class="activity">${screen.width}x${screen.height}</span><br>
</div>`;
    },
    
    date: () => `<div class="command-output">${new Date().toString()}</div>`,
    
    uptime: () => {
        const now = Date.now();
        const uptimeMs = now - startTime;
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        
        let uptimeStr = '';
        if (hours > 0) uptimeStr += `${hours}h `;
        if (minutes > 0) uptimeStr += `${minutes}m `;
        uptimeStr += `${seconds}s`;
        
        return `<div class="command-output">
<span class="info">System uptime:</span> <span class="highlight">${uptimeStr}</span><br>
<span class="info">Load average:</span> <span class="activity">0.42, 0.37, 0.31</span><br>
<span class="info">Users:</span> <span class="activity">1 user logged in</span>
</div>`;
    },
    
    ls: () => `<div class="command-output">about.txt  skills.md  projects/  social_links/</div>`,
    
    pwd: () => `<div class="command-output">/home/twigform</div>`,
    
    cat: (args) => {
        if (!args) {
            return `<div class="error">cat: missing file operand</div>`;
        }
        
        const filename = args.trim();
        if (files[filename]) {
            const content = files[filename].replace(/\n/g, '<br>');
            return `<div class="command-output">${content}</div>`;
        } else {
            return `<div class="error">cat: ${filename}: No such file or directory</div>`;
        }
    },
    
    echo: (args) => `<div class="command-output">${args || ''}</div>`,
    
    meow: async () => {
        try {
            const catNumber = Math.floor(Math.random() * 181) + 1;
            const response = await fetch(`https://raw.githubusercontent.com/PixelSergey/meow/main/cats/cat${catNumber}.txt`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const catAscii = await response.text();
            return `<div class="command-output"><pre style="color: var(--yellow); line-height: 1; font-size: 12px; white-space: pre;">${catAscii}</pre></div>`;
        } catch (error) {
            return `<div class="error">meow: Failed to fetch cat (${error.message})... sorry! :(</div>`;
        }
    },
    
    palla: async () => {
        try {
            const response = await fetch('https://tenor.googleapis.com/v2/search?q=pallas%20cat&key=LIVDSRZULELA&limit=50&random=true');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                const gif = data.results[randomIndex];
                const gifUrl = gif.media_formats.gif.url;
                
                return `<div class="command-output">
<img src="${gifUrl}" alt="Pallas Cat GIF" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; display: block;">
<div style="color: var(--subtext0); font-size: 0.8rem; margin-top: 5px;"> > Random pallas cat via Tenor</div>
</div>`;
            } else {
                return `<div class="error">No pallas cat GIFs found... that's unusual! :(</div>`;
            }
        } catch (error) {
            return `<div class="error">palla: Failed to fetch pallas cat GIF (${error.message})... the cats are hiding! :(</div>`;
        }
    },
    
    cowsay: (args) => {
        const text = args || "Hello from twigform!";
        const maxWidth = 40;
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            if ((currentLine + word).length <= maxWidth) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    lines.push(word.substring(0, maxWidth));
                    currentLine = word.substring(maxWidth);
                }
            }
        }
        if (currentLine) lines.push(currentLine);
        
        const longestLine = Math.max(...lines.map(line => line.length));
        const bubbleWidth = Math.max(longestLine + 2, 4);
        
        let bubble = ' ' + '_'.repeat(bubbleWidth) + '\n';
        
        if (lines.length === 1) {
            bubble += `< ${lines[0].padEnd(longestLine)} >\n`;
        } else {
            lines.forEach((line, index) => {
                const paddedLine = line.padEnd(longestLine);
                if (index === 0) {
                    bubble += `/ ${paddedLine} \\\n`;
                } else if (index === lines.length - 1) {
                    bubble += `\\ ${paddedLine} /\n`;
                } else {
                    bubble += `| ${paddedLine} |\n`;
                }
            });
        }
        
        bubble += ' ' + '-'.repeat(bubbleWidth);
        
        const cowArt = `        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
                
        return `<div class="command-output"><pre style="color: var(--yellow); line-height: 1; font-size: 12px; white-space: pre;">${bubble}\n${cowArt}</pre></div>`;
    },    'fuck you': () => `<div class="command-output"><span class="highlight">fuck you too!</span></div>`,
    
    'sudo rm -rf /': () => {
        initiateSystemDestruction();
        return `<div class="error">
</div>`;
    },
    
    lolcat: (args) => {
        const text = args || "Hello from twigform!";
        const rainbowColors = [
            '#f38ba8',
            '#fab387',
            '#f9e2af',
            '#a6e3a1',
            '#94e2d5',
            '#89dceb',
            '#89b4fa',
            '#cba6f7',
            '#f5c2e7' 
        ];
        
        let coloredText = '';
        const characters = text.split('');
        
        characters.forEach((char, index) => {
            const colorIndex = index % rainbowColors.length;
            const color = rainbowColors[colorIndex];
            coloredText += `<span style="color: ${color}; font-weight: bold;">${char}</span>`;
        });
        
        return `<div class="command-output">${coloredText}</div>`;
    },
    
    accent: (args) => {
        const catppuccinColors = [
            { name: 'rosewater', value: '#f5e0dc' },
            { name: 'flamingo', value: '#f2cdcd' },
            { name: 'pink', value: '#f5c2e7' },
            { name: 'mauve', value: '#cba6f7' },
            { name: 'red', value: '#f38ba8' },
            { name: 'maroon', value: '#eba0ac' },
            { name: 'peach', value: '#fab387' },
            { name: 'yellow', value: '#f9e2af' },
            { name: 'green', value: '#a6e3a1' },
            { name: 'teal', value: '#94e2d5' },
            { name: 'sky', value: '#89dceb' },
            { name: 'sapphire', value: '#74c7ec' },
            { name: 'blue', value: '#89b4fa' },
            { name: 'lavender', value: '#b4befe' }
        ];
        
        const argument = args ? args.trim().toLowerCase() : '';
        
        if (argument === 'list') {
            let colorList = '<div class="command-output"><span class="info">Available accent colors:</span><br><br>';
            catppuccinColors.forEach(color => {
                colorList += `<span class="tree-branch">├──</span> <span class="highlight">${color.name}</span> <span style="color: ${color.value};">●</span><br>`;
            });
            colorList += '<br><span class="info">Usage:</span><br>';
            colorList += '<span class="tree-branch">├──</span> <span class="highlight">accent</span> <span class="activity">(random color)</span><br>';
            colorList += '<span class="tree-branch">├──</span> <span class="highlight">accent list</span> <span class="activity">(show this list)</span><br>';
            colorList += '<span class="tree-branch">└──</span> <span class="highlight">accent &lt;color&gt;</span> <span class="activity">(specific color)</span><br>';
            colorList += '</div>';
            return colorList;
        }
        
        let selectedColor;
        
        if (argument) {
            selectedColor = catppuccinColors.find(color => color.name.toLowerCase() === argument);
            
            if (!selectedColor) {
                return `<div class="command-output">
<span class="error">Unknown color: ${argument}</span><br>
<span class="info">Use 'accent list' to see available colors</span><br>
</div>`;
            }
        } else {
            selectedColor = catppuccinColors[Math.floor(Math.random() * catppuccinColors.length)];
        }
        
        document.documentElement.style.setProperty('--mauve', selectedColor.value);
        
        const cornerSvgPath = document.querySelector('.corner-svg path');
        if (cornerSvgPath) {
            cornerSvgPath.style.fill = selectedColor.value;
        }
        
        const accentType = argument ? 'selected' : 'randomly set to';
          return `<div class="command-output">
<span class="info">Accent ${accentType}!</span><br>
<span class="tree-branch">└──</span> <span class="highlight">Accent color:</span> <span class="activity" style="color: ${selectedColor.value};">${selectedColor.name}</span> <span style="color: ${selectedColor.value};">●</span><br>
</div>`;
    },
    
    theme: (args) => {
        const argument = args ? args.trim().toLowerCase() : '';
        
        if (argument === 'list') {
            let themeList = '<div class="command-output"><span class="info">Available themes:</span><br><br>';
            Object.entries(themes).forEach(([key, theme]) => {
                const indicator = key === currentTheme ? ' <span style="color: var(--green);">●</span>' : '';
                themeList += `<span class="tree-branch">├──</span> <span class="highlight">${key}</span> <span class="activity">(${theme.name})</span>${indicator}<br>`;
            });
            themeList += '<br><span class="info">Usage:</span><br>';
            themeList += '<span class="tree-branch">├──</span> <span class="highlight">theme</span> <span class="activity">(show current theme)</span><br>';
            themeList += '<span class="tree-branch">├──</span> <span class="highlight">theme list</span> <span class="activity">(show this list)</span><br>';
            themeList += '<span class="tree-branch">└──</span> <span class="highlight">theme &lt;name&gt;</span> <span class="activity">(switch theme)</span><br>';
            themeList += '</div>';
            return themeList;
        }
        
        if (!argument) {
            const theme = themes[currentTheme];
            return `<div class="command-output">
<span class="info">Current theme:</span><br>
<span class="tree-branch">└──</span> <span class="highlight">${currentTheme}</span> <span class="activity">(${theme.name})</span> <span style="color: var(--green);">●</span><br>
</div>`;
        }
        
        if (!themes[argument]) {
            const availableThemes = Object.keys(themes).join(', ');
            return `<div class="command-output">
<span class="error">Unknown theme: ${argument}</span><br>
<span class="info">Available themes: ${availableThemes}</span><br>
<span class="info">Use 'theme list' for more details</span><br>
</div>`;
        }
        
        applyTheme(argument);
        currentTheme = argument;
        
        const theme = themes[argument];
        return `<div class="command-output">
<span class="info">Theme switched!</span><br>
<span class="tree-branch">└──</span> <span class="highlight">Active theme:</span> <span class="activity">${argument} (${theme.name})</span> <span style="color: var(--green);">●</span><br>
</div>`;
    },
};

function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;
    
    Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
        document.documentElement.style.setProperty(`--${colorName}`, colorValue);
    });
    
    const cornerSvgPath = document.querySelector('.corner-svg path');
    if (cornerSvgPath) {
        cornerSvgPath.style.fill = theme.colors.mauve;
    }
    
    localStorage.setItem('twigform-theme', themeName);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('twigform-theme');
    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
        currentTheme = savedTheme;
    }
}

function executeCommand(cmd) {
    if (commandInProgress) return;
    commandInProgress = true;
    
    const trimmedCmd = cmd.trim();
    
    if (trimmedCmd && (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== trimmedCmd)) {
        commandHistory.push(trimmedCmd);
        if (commandHistory.length > 50) {
            commandHistory.shift();
        }
    }
    
    historyIndex = -1;
    
    const parts = trimmedCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    const commandLine = document.createElement('div');
    commandLine.innerHTML = `<span class="user">user</span><span class="prompt">@</span><span class="host">twigform</span><span class="prompt">:~$</span> ${cmd}`;
    
    output.appendChild(commandLine);
    
    const allCurrentLines = document.querySelectorAll('.current-line');
    allCurrentLines.forEach(line => line.remove());
    
    const fullCommand = trimmedCmd.toLowerCase();
    if (commands[fullCommand]) {
        processCommandResult(commands[fullCommand](args));
    } else if (commands[command]) {
        processCommandResult(commands[command](args));
    } else if (trimmedCmd) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = `zsh: command not found: ${command}`;
        output.appendChild(errorDiv);
        finishCommand();
    } else {
        finishCommand();
    }
    
    scrollToBottom();
}

function processCommandResult(result) {
    if (result instanceof Promise) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'info';
        loadingDiv.textContent = 'Loading...';
        output.appendChild(loadingDiv);
        result.then(asyncResult => {
            if (asyncResult) {
                loadingDiv.outerHTML = asyncResult;
            } else {
                loadingDiv.remove();
            }
            finishCommand();
            scrollToBottom();
        }).catch(() => finishCommand());
    } else if (result) {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = result;
        output.appendChild(resultDiv);
        finishCommand();
    } else {
        finishCommand();
    }
}

function finishCommand() {
    setTimeout(() => {
        createNewPromptLine();
        commandInProgress = false;
    }, 10);
}

function createNewPromptLine() {
    const oldLines = document.querySelectorAll('.current-line');
    oldLines.forEach(line => line.remove());
    
    const newLine = document.createElement('div');
    newLine.className = 'current-line';
    newLine.innerHTML = `
        <span class="user">user</span><span class="prompt">@</span><span class="host">twigform</span><span class="prompt">:~$</span>
        <div class="current-input">
            <div class="inline-suggestion" id="inlineSuggestion"></div>
            <input type="text" class="input-field" id="commandInput" autocomplete="off" spellcheck="false">
        </div>
    `;
    
    const content = document.querySelector('.content');
    content.appendChild(newLine);
    
    const newInput = newLine.querySelector('#commandInput');
    const newSuggestion = newLine.querySelector('#inlineSuggestion');
    
    window.input = newInput;
    window.suggestionText = newSuggestion;
    
    attachInputListeners(newInput, newSuggestion);
    
    newInput.focus();
}

function attachInputListeners(inputElement, suggestionElement) {
    inputElement.addEventListener('input', () => {
        updateSuggestionForElement(inputElement, suggestionElement);
    });
      inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && currentSuggestion) {
            e.preventDefault();
            acceptSuggestionForElement(inputElement);
            return;
        } else if (e.key === 'ArrowRight' && currentSuggestion && inputElement.selectionStart === inputElement.value.length) {
            e.preventDefault();
            acceptSuggestionForElement(inputElement);
            return;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateHistoryForElement('up', inputElement, suggestionElement);
            return;
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateHistoryForElement('down', inputElement, suggestionElement);
            return;
        }
        
        if (e.key === 'Enter') {
            const cmd = inputElement.value;
            executeCommand(cmd);
        }
    });
}

function updateSuggestionForElement(inputElement, suggestionElement) {
    const inputValue = inputElement.value;
    const trimmed = inputValue.trim();
    const parts = trimmed.split(' ');
    
    if (!trimmed) {
        suggestionElement.innerHTML = '';
        currentSuggestion = '';
        return;
    }
    
    const suggestion = getAutocompleteSuggestion(inputValue);
    currentSuggestion = suggestion;
    
    if (suggestion) {
        let displayText = '';
          if (parts.length === 1) {
            displayText = `<span class="typed-part">${trimmed}</span><span class="suggestion-part">${suggestion.substring(trimmed.length)}</span>`;
        } else if ((parts[0].toLowerCase() === 'cat' || parts[0].toLowerCase() === 'theme' || parts[0].toLowerCase() === 'accent') && parts.length === 2) {
            const args = parts.slice(1).join(' ');
            displayText = `<span class="typed-part">${parts[0]} ${args}</span><span class="suggestion-part">${suggestion.substring(args.length)}</span>`;
        }
        
        suggestionElement.innerHTML = displayText;
    } else {
        suggestionElement.innerHTML = '';
    }
}

function acceptSuggestionForElement(inputElement) {
    if (!currentSuggestion) return false;
    
    const inputValue = inputElement.value.trim();
    const parts = inputValue.split(' ');
      if (parts.length === 1) {
        inputElement.value = currentSuggestion;
    } else if ((parts[0].toLowerCase() === 'cat' || parts[0].toLowerCase() === 'theme' || parts[0].toLowerCase() === 'accent') && parts.length === 2) {
        inputElement.value = parts[0] + ' ' + currentSuggestion;
    }
      updateSuggestionForElement(inputElement, suggestionText);
    return true;
}

function navigateHistoryForElement(direction, inputElement, suggestionElement) {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
        if (historyIndex === -1) {
            historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
            historyIndex--;
        }
    } else if (direction === 'down') {
        if (historyIndex === -1) {
            return;
        } else if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
        } else {
            historyIndex = -1;
            inputElement.value = '';
            updateSuggestionForElement(inputElement, suggestionElement);
            return;
        }
    }
    
    if (historyIndex >= 0 && historyIndex < commandHistory.length) {
        inputElement.value = commandHistory[historyIndex];
        updateSuggestionForElement(inputElement, suggestionElement);
        setTimeout(() => {
            inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
        }, 0);
    }
}

function scrollToBottom() {
    const contentArea = document.querySelector('.content');
    setTimeout(() => {
        contentArea.scrollTop = contentArea.scrollHeight;
    }, 50);
}

attachInputListeners(input, suggestionText);

document.querySelector('.terminal-window').addEventListener('click', (e) => {
    const currentInput = document.querySelector('.current-line input');
    if (currentInput) {
        currentInput.focus();
    }
});

input.focus();

const svg = document.querySelector('.corner-svg');
const container = document.querySelector('.corner-svg-container');
const socialIcons = document.querySelector('.social-icons');
let rotation = 0;
let animationId = null;
let isExpanded = false;

function rotateSvg() {
    rotation = (rotation + 0.2) % 360;
    svg.style.transform = `rotate(${rotation}deg)`;
    animationId = requestAnimationFrame(rotateSvg);
}

function startAnimation() {
    if (!animationId && !isExpanded) {
        animationId = requestAnimationFrame(rotateSvg);
    }
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function toggleExpand() {
    isExpanded = !isExpanded;
    if (isExpanded) {
        stopAnimation();
        svg.style.transform = `rotate(${rotation}deg) scale(1.5)`;
        socialIcons.classList.add('visible');
        socialIcons.querySelectorAll('.social-icon').forEach((icon, i) => {
            icon.style.transitionDelay = (0.08 * i + 0.05) + 's';
        });
    } else {
        svg.style.transform = `rotate(${rotation}deg) scale(1.0)`;
        socialIcons.querySelectorAll('.social-icon').forEach((icon) => {
            icon.style.transitionDelay = '0s';
        });
        socialIcons.classList.remove('visible');
        setTimeout(() => {
            startAnimation();
        }, 300);
    }
}

container.addEventListener('click', toggleExpand);

container.addEventListener('mouseenter', () => {
    if (!isExpanded) {
        stopAnimation();
        svg.style.transform = `rotate(${rotation}deg) scale(1.2)`;
    }
});

container.addEventListener('mouseleave', () => {
    if (!isExpanded) {
        const currentRotation = rotation;
        svg.style.transform = `rotate(${currentRotation}deg) scale(1.0)`;
        setTimeout(() => {
            svg.style.transform = `rotate(${currentRotation}deg)`;
            startAnimation();
        }, 300);
    }
});

container.addEventListener('focus', () => {
    if (!isExpanded) {
        stopAnimation();
        svg.style.transform = `rotate(${rotation}deg) scale(1.2)`;
    }
});

container.addEventListener('blur', () => {
    if (!isExpanded) {
        const currentRotation = rotation;
        svg.style.transform = `rotate(${currentRotation}deg) scale(1.0)`;
        setTimeout(() => {
            svg.style.transform = `rotate(${currentRotation}deg)`;
            startAnimation();
        }, 300);
    }
});

container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        toggleExpand();
        e.preventDefault();
    }
});

document.body.addEventListener('click', (e) => {
    if (isExpanded && !container.contains(e.target)) {
        toggleExpand();
    }
});

startAnimation();

const discordStatusButton = document.getElementById('discordStatusButton');
const discordStatusModal = document.getElementById('discordStatusModal');
const userId = '970448540335759461';

discordStatusButton.addEventListener('click', (e) => {
    e.preventDefault();
    discordStatusModal.classList.toggle('active');
    if (discordStatusModal.classList.contains('active')) {
        fetchDiscordStatus();
    }
});

document.addEventListener('click', (e) => {
    if (!discordStatusModal.contains(e.target) && e.target !== discordStatusButton && !discordStatusButton.contains(e.target)) {
        discordStatusModal.classList.remove('active');
    }
});

async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            updateDiscordStatusUI(data.data);
        } else {
            showOfflineStatus();
        }
    } catch (error) {
        console.error('Error fetching Discord status:', error);
        showOfflineStatus();
    }
}

function updateDiscordStatusUI(data) {
    document.getElementById('discordUsername').textContent = data.discord_user.username;
    document.getElementById('discordAvatar').src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`;

    const statusIndicator = document.getElementById('discordStatusIndicator');
    const statusText = document.getElementById('discordStatusText');
    
    statusIndicator.className = 'discord-status-indicator';
    
    switch (data.discord_status) {
        case 'online':
            statusIndicator.classList.add('status-online');
            statusText.textContent = 'Online';
            break;
        case 'idle':
            statusIndicator.classList.add('status-idle');
            statusText.textContent = 'Idle';
            break;
        case 'dnd':
            statusIndicator.classList.add('status-dnd');
            statusText.textContent = 'Do Not Disturb';
            break;
        default:
            statusIndicator.classList.add('status-offline');
            statusText.textContent = 'Offline';
    }

    const spotifySection = document.getElementById('discordSpotifySection');
    if (data.listening_to_spotify) {
        spotifySection.style.display = 'block';
        document.getElementById('discordSpotifySong').textContent = data.spotify.song;
        document.getElementById('discordSpotifyArtist').textContent = data.spotify.artist;
        document.getElementById('discordSpotifyAlbum').src = data.spotify.album_art_url;
    } else {
        spotifySection.style.display = 'none';
    }

    const gameSection = document.getElementById('discordGameSection');
    const gameActivity = data.activities?.find(activity => 
        activity.type === 0 && activity.name !== 'Spotify'
    );
    
    if (gameActivity) {
        gameSection.style.display = 'block';
        document.getElementById('discordGameName').textContent = gameActivity.name;
        
        const gameDetails = document.getElementById('discordGameDetails');
        let detailsText = '';
        if (gameActivity.details) detailsText += gameActivity.details;
        if (gameActivity.state) {
            if (detailsText) detailsText += '\n';
            detailsText += gameActivity.state;
        }
        gameDetails.textContent = detailsText;
    } else {
        gameSection.style.display = 'none';
    }
}

function showOfflineStatus() {
    document.getElementById('discordUsername').textContent = 'twigform';
    document.getElementById('discordStatusText').textContent = 'Offline';
    document.getElementById('discordStatusIndicator').className = 'discord-status-indicator status-offline';
    document.getElementById('discordSpotifySection').style.display = 'none';
    document.getElementById('discordGameSection').style.display = 'none';
}

setInterval(() => {
    if (discordStatusModal.classList.contains('active')) {
        fetchDiscordStatus();
    }
}, 30000);

window.addEventListener('load', () => {
    initializeTerminal();
    loadSavedTheme();
});

let isDragging = false;
let isResizing = false;
let isMaximized = false;
let dragStartX = 0;
let dragStartY = 0;
let terminalStartX = 0;
let terminalStartY = 0;
let resizeStartX = 0;
let resizeStartY = 0;
let terminalStartWidth = 0;
let terminalStartHeight = 0;
let savedPosition = { x: 0, y: 0, width: 800, height: 600 };

const terminalWindow = document.querySelector('.terminal-window');

const resizeHandle = document.createElement('div');
resizeHandle.className = 'resize-handle';
terminalWindow.appendChild(resizeHandle);

function startDrag(e) {
    if (e.target.closest('.input-field') || 
        e.target.closest('.terminal-button') || 
        e.target.closest('.social-icon') ||
        e.target.closest('.corner-svg-container') ||
        e.target.closest('.resize-handle') ||
        isResizing || 
        isMaximized) {
        return;
    }
      isDragging = true;
    terminalWindow.classList.add('dragging');
    
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    
    const rect = terminalWindow.getBoundingClientRect();
    terminalStartX = rect.left;
    terminalStartY = rect.top;
    
    terminalWindow.style.position = 'absolute';
    terminalWindow.style.left = terminalStartX + 'px';
    terminalWindow.style.top = terminalStartY + 'px';
    terminalWindow.style.margin = '0';
    
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    e.preventDefault();
    e.stopPropagation();
}

function startResize(e) {
    if (isMaximized) return;
    
    isDragging = false;
    isResizing = true;
    terminalWindow.classList.remove('dragging');
    terminalWindow.classList.add('resizing');
    
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    
    const rect = terminalWindow.getBoundingClientRect();
    terminalStartWidth = rect.width;
    terminalStartHeight = rect.height;
    
    if (terminalWindow.style.position !== 'absolute') {
        terminalWindow.style.position = 'absolute';
        terminalWindow.style.left = rect.left + 'px';
        terminalWindow.style.top = rect.top + 'px';
        terminalWindow.style.margin = '0';
    }
    
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    e.preventDefault();
    e.stopPropagation();
}

function handleMouseMove(e) {
    if (!isDragging && !isResizing) return;
      if (isDragging && !isResizing) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        
        let newX = terminalStartX + deltaX;
        let newY = terminalStartY + deltaY;
        
        const rect = terminalWindow.getBoundingClientRect();
        const terminalWidth = rect.width;
        const terminalHeight = rect.height;
        
        const maxX = window.innerWidth - terminalWidth;
        const maxY = window.innerHeight - terminalHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        terminalWindow.style.left = newX + 'px';
        terminalWindow.style.top = newY + 'px';
    }
    
    if (isResizing && !isDragging) {
        const deltaX = e.clientX - resizeStartX;
        const deltaY = e.clientY - resizeStartY;
        
        let newWidth = terminalStartWidth + deltaX;
        let newHeight = terminalStartHeight + deltaY;
        
        const minWidth = 400;
        const minHeight = 300;
        const maxWidth = window.innerWidth * 0.95;
        const maxHeight = window.innerHeight * 0.95;
        
        newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
        
        const rect = terminalWindow.getBoundingClientRect();
        if (rect.left + newWidth > window.innerWidth) {
            newWidth = window.innerWidth - rect.left;
        }
        if (rect.top + newHeight > window.innerHeight) {
            newHeight = window.innerHeight - rect.top;
        }
        
        terminalWindow.style.width = newWidth + 'px';
        terminalWindow.style.height = newHeight + 'px';
        terminalWindow.style.maxWidth = 'none';
    }
    
    e.preventDefault();
}

function stopDragResize() {
    if (!isDragging && !isResizing) return;
      isDragging = false;
    isResizing = false;
    terminalWindow.classList.remove('dragging', 'resizing');
    
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
}

function maximizeWindow() {
    if (!isMaximized) {
        const rect = terminalWindow.getBoundingClientRect();
        savedPosition = {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        };
        
        terminalWindow.style.position = 'fixed';
        terminalWindow.style.margin = '0';
        
        terminalWindow.classList.add('maximized');
        isMaximized = true;
    } else {
        restoreWindow();
    }
}

function restoreWindow() {
    if (isMaximized) {
        terminalWindow.classList.remove('maximized');
        
        terminalWindow.style.position = 'absolute';
        terminalWindow.style.left = savedPosition.x + 'px';
        terminalWindow.style.top = savedPosition.y + 'px';
        terminalWindow.style.width = savedPosition.width + 'px';
        terminalWindow.style.height = savedPosition.height + 'px';
        terminalWindow.style.maxWidth = '95vw';
        terminalWindow.style.maxHeight = '95vh';
        
        isMaximized = false;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        maximizeWindow();
    }
    
    if (e.key === 'Escape' && isMaximized) {
        e.preventDefault();
        restoreWindow();
    }
});

terminalWindow.addEventListener('mousedown', startDrag);
resizeHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    startResize(e);
});

document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', stopDragResize);

document.addEventListener('mouseleave', stopDragResize);

terminalWindow.addEventListener('touchstart', (e) => {
    if (e.target.closest('.resize-handle')) {
        e.stopPropagation();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        startResize(mouseEvent);
    } else {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        startDrag(mouseEvent);
    }
}, { passive: false });

resizeHandle.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    startResize(mouseEvent);
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isDragging && !isResizing) return;
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    handleMouseMove(mouseEvent);
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', stopDragResize);

function initiateSystemDestruction() {
    const elements = [
        document.querySelector('.corner-svg-container'),
        document.querySelector('.suggestion-overlay'),
        document.querySelector('#inlineSuggestion'),
        document.querySelector('#commandInput'),
        document.querySelector('.current-line .prompt'),
        ...document.querySelectorAll('.command-output'),
        ...document.querySelectorAll('.terminal-line'),
        document.querySelector('#output'),
        document.querySelector('.terminal'),
        document.querySelector('body')
    ].filter(el => el);

    const stylesToRemove = [
        '--mauve',
        '--text',
        '--base',
        '--surface0',
        '--surface1',
        '--green',
        '--red',
        '--yellow',
        '--blue',
        '--pink',
        '--peach',
        '--teal',
        '--sky'
    ];

    let destructionIndex = 0;
    let styleIndex = 0;

    const destructionMessages = [
        "rm: removing '/usr/bin'...",
        "rm: removing '/home'...", 
        "rm: removing '/var'...",
        "rm: removing '/etc'...",
        "rm: removing '/boot'...",
        "rm: removing terminal interface...",
        "rm: removing display drivers...",
        "rm: removing system processes...",
        "rm: removing kernel modules...",
        "rm: removing filesystem...",
        "rm: removing root directory...",
        "System destroyed."
    ];

    function destroyNext() {
        if (destructionIndex < destructionMessages.length && document.querySelector('#output')) {
            const messageLine = document.createElement('div');
            messageLine.className = 'terminal-line';
            messageLine.innerHTML = `<span class="error">${destructionMessages[destructionIndex]}</span>`;
            document.querySelector('#output').appendChild(messageLine);
        }        
        if (destructionIndex < elements.length) {
            const element = elements[destructionIndex];
            if (element && element.parentNode) {
                element.remove();
            }
        }

        if (styleIndex < stylesToRemove.length) {
            document.documentElement.style.removeProperty(stylesToRemove[styleIndex]);
            styleIndex++;
        }

        const body = document.body;
        if (body) {
            const currentOpacity = parseFloat(getComputedStyle(body).opacity) || 1;
            body.style.opacity = Math.max(0, currentOpacity - 0.08);
            
            if (destructionIndex > 8) {
                body.style.backgroundColor = '#000000';
            }
        }

        destructionIndex++;

        if (destructionIndex < Math.max(elements.length, destructionMessages.length, 12)) {
            setTimeout(destroyNext, Math.random() * 800 + 400);
        } else {
            setTimeout(() => {
                document.body.innerHTML = '<div style="color: #f38ba8; font-family: monospace; padding: 20px; text-align: center;">rm: /: Permission denied (Operation not permitted)<br><br>Just kidding! <a href="javascript:location.reload()" style="color: #89b4fa;">Click here to restore</a></div>';
                document.body.style.backgroundColor = '#000000';
                document.body.style.opacity = '1';
            }, 1000);
        }
    }

    setTimeout(destroyNext, 1000);
}
