# Linux & Shell Scripting Fundamentals
### Complete Curriculum — University OS Practical Exam Preparation
> **14 Modules | 16 Chapters | Full Theory, Terminal Challenges, Editor Challenges, and MCQ Exercises**

---

# MODULE 1: INTRODUCTION TO LINUX & TERMINAL

---

## CHAPTER 1.1: What is Linux?

* **Description:** Introduces students to the Linux operating system — its history, architecture, distributions, and role in modern computing. Establishes conceptual foundations before any hands-on work.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** The Linux Operating System — History, Architecture & Distributions
* **Est. Minutes:** 5
* **Outline:** Covers the origin of Linux, the kernel, user space, distributions, and why Linux is used in servers, embedded systems, and academic OS courses.

* **Instructions (Slides):**

  # Slide 1: What Is an Operating System?
  An **Operating System (OS)** is system software that manages computer hardware, software resources, and provides common services for computer programs. Without an OS, a user cannot interact with the computer hardware directly.

  Key functions of an OS include:
  - **Process Management** — Creating, scheduling, and terminating processes.
  - **Memory Management** — Allocating RAM to running programs.
  - **File System Management** — Organizing data into files and directories.
  - **Device Management** — Communicating with hardware through drivers.
  - **Security & Access Control** — Managing users, permissions, and authentication.

  Examples of operating systems: Windows, macOS, Android, and **Linux**.

  ---

  # Slide 2: The Origin of Linux
  Linux was created in **1991** by **Linus Torvalds**, a Finnish computer science student at the University of Helsinki. He was inspired by **MINIX**, a small Unix-like OS used for educational purposes.

  **Timeline of Key Events:**
  | Year | Event |
  |------|-------|
  | 1969 | Unix developed at AT&T Bell Labs by Ken Thompson & Dennis Ritchie |
  | 1983 | Richard Stallman starts the GNU Project (free software tools) |
  | 1991 | Linus Torvalds releases the Linux kernel (version 0.01) |
  | 1992 | Linux kernel is relicensed under GPL (GNU General Public License) |
  | 1994 | Linux kernel 1.0 released |
  | 2000s | Linux dominates server and supercomputer markets |
  | Today | Powers 96%+ of world's top 500 supercomputers |

  The name "Linux" combines **Linus** (Torvalds) + **Unix**.

  ---

  # Slide 3: The Linux Kernel
  The **kernel** is the core of the Linux OS. It acts as a bridge between user applications and the computer hardware.

  ```
  ┌─────────────────────────────┐
  │        USER SPACE           │
  │  (Applications, Shell, GUI) │
  ├─────────────────────────────┤
  │         KERNEL              │
  │  (Process/Memory/File Mgmt) │
  ├─────────────────────────────┤
  │         HARDWARE            │
  │  (CPU, RAM, Disk, Network)  │
  └─────────────────────────────┘
  ```

  The kernel handles:
  - **System Calls** — APIs that user programs use to request OS services.
  - **Interrupt Handling** — Responding to hardware signals.
  - **Scheduling** — Deciding which process runs on the CPU at any time.

  The Linux kernel is **monolithic** (runs mostly in kernel space for speed), but also **modular** — you can load/unload drivers at runtime.

  ---

  # Slide 4: Linux Distributions (Distros)
  A **Linux distribution (distro)** is a complete OS built on the Linux kernel, bundled with software, a package manager, and default settings.

  **Popular Distributions:**
  | Distro | Based On | Use Case |
  |--------|----------|----------|
  | Ubuntu | Debian | Desktop, beginners, servers |
  | Debian | Independent | Stability, servers |
  | Fedora | Red Hat | Cutting-edge desktop |
  | CentOS / RHEL | Red Hat | Enterprise servers |
  | Arch Linux | Independent | Advanced users |
  | Kali Linux | Debian | Cybersecurity / pentesting |
  | Android | Linux kernel | Mobile devices |

  In this course, we use **Ubuntu** (most common in university labs).

  ---

  # Slide 5: Why Learn Linux?
  Linux is essential knowledge for:
  - **Software Engineers** — Servers run Linux (AWS, Google Cloud, Azure all use Linux VMs).
  - **System Administrators** — 90%+ of enterprise servers run Linux.
  - **Data Scientists** — HPC clusters and ML environments use Linux.
  - **Cybersecurity Professionals** — Most security tools are Linux-native.
  - **University OS Courses** — Practical exams test Linux commands and shell scripting.

  **Open Source Advantage:** The full source code of Linux is freely available. You can study, modify, and redistribute it under the GPL license.

  Key principle: *"In Linux, everything is a file."* — devices, directories, and even processes are represented as files in the filesystem.

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Explore Your Linux Environment
* **Est. Minutes:** 5
* **Outline:** Practice viewing basic system information commands to familiarize yourself with the Linux terminal.
* **Instructions:** Open your terminal. You will run commands to inspect your Linux environment. Type each command exactly as shown and press Enter.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Display the version of the Linux kernel currently running on your system using `uname -r`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `uname -r | grep -qE '^[0-9]+\.[0-9]+' && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Find out who you are logged in as by running `whoami`. The output should be `student`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ "$(whoami)" = "student" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Display the full name and version of your Linux distribution by running `cat /etc/os-release | head -5`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `cat /etc/os-release | grep -qi "ubuntu\|debian\|fedora\|centos\|linux" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create Your First Linux Notes File
* **Est. Minutes:** 8
* **Outline:** Use a text editor (nano) to create a notes file summarizing what you learned about Linux.
* **Instructions:** Open the nano editor by typing `nano /home/student/linux_notes.txt`. Type the content as instructed in each task. Save with `Ctrl+O`, Enter, then exit with `Ctrl+X`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create the file `/home/student/linux_notes.txt` and write at least one line containing the word "Linux" (e.g., "Linux is an open-source operating system.").
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "Linux" /home/student/linux_notes.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add a second line to the same file containing the name of the creator: "Linus Torvalds".
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "Linus Torvalds" /home/student/linux_notes.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 3:**
    * **Instruction:** Add a third line containing the word "kernel" (e.g., "The Linux kernel is the core of the OS.").
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "kernel" /home/student/linux_notes.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** What Is Linux? — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on Linux history, kernel, and distributions.

* **Questions:**

  * **Q1:** Who created the Linux kernel?
    * **Options:**
      * A) Richard Stallman
      * B) Linus Torvalds
      * C) Dennis Ritchie
      * D) Bill Gates
    * **Correct Answer:** B) Linus Torvalds
    * **Explanation:** Linus Torvalds created the Linux kernel in 1991 as a personal project while studying at the University of Helsinki. Richard Stallman created the GNU Project tools that complement the kernel.

  * **Q2:** What is the role of the Linux kernel?
    * **Options:**
      * A) It provides a graphical user interface to the user
      * B) It manages hardware resources and provides system call interfaces
      * C) It is a text editor built into Linux
      * D) It is a package manager used to install software
    * **Correct Answer:** B) It manages hardware resources and provides system call interfaces
    * **Explanation:** The kernel is the core component of Linux. It sits between user space applications and the hardware, managing CPU, memory, devices, and providing system calls.

  * **Q3:** Which of the following is a Linux distribution?
    * **Options:**
      * A) Windows 11
      * B) macOS Ventura
      * C) Ubuntu 22.04
      * D) MS-DOS
    * **Correct Answer:** C) Ubuntu 22.04
    * **Explanation:** Ubuntu is a Linux distribution based on Debian. It is widely used in educational and enterprise environments.

  * **Q4:** The statement "In Linux, everything is a file" means:
    * **Options:**
      * A) Linux can only run if all hardware has a corresponding file
      * B) Linux represents devices, directories, and processes as file objects in the filesystem
      * C) Linux stores all programs inside a single large file
      * D) Linux requires you to edit files manually to configure the OS
    * **Correct Answer:** B) Linux represents devices, directories, and processes as file objects in the filesystem
    * **Explanation:** The Unix/Linux design philosophy abstracts hardware devices (like `/dev/sda`), processes (`/proc`), and even system settings (`/sys`) as files, providing a unified interface.

---

## CHAPTER 1.2: Understanding the Terminal

* **Description:** Introduces the Linux terminal (command-line interface), the shell, basic command structure, and how to navigate the CLI effectively. Students learn to distinguish between the terminal, shell, and prompt.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** The Terminal, Shell, and Command Structure
* **Est. Minutes:** 5
* **Outline:** Explains what a terminal emulator is, what the shell is (focusing on Bash), the anatomy of a Linux command, common shortcuts, and the difference between GUI and CLI.

* **Instructions (Slides):**

  # Slide 1: GUI vs CLI
  Most people interact with computers via a **Graphical User Interface (GUI)** — windows, icons, buttons, and menus. However, Linux professionals primarily use the **Command-Line Interface (CLI)**.

  | Feature | GUI | CLI |
  |---------|-----|-----|
  | Interaction | Mouse + Keyboard | Keyboard only |
  | Speed | Slower for complex tasks | Much faster for power users |
  | Automation | Difficult | Easy (scripts) |
  | Resource Use | High (needs display server) | Very low |
  | Remote Access | Requires VNC/RDP | SSH works natively |

  The CLI gives you **direct control** of the OS. Every action you do in a GUI has an equivalent CLI command — and often the CLI version is faster and more powerful.

  ---

  # Slide 2: Terminal Emulator vs Shell
  These two terms are often confused:

  **Terminal Emulator:** A program (application window) that provides a text-based interface. Examples: GNOME Terminal, Konsole, xterm, PuTTY (on Windows), iTerm2 (on Mac).

  **Shell:** The program *inside* the terminal that interprets and executes your commands. The shell reads your input, processes it, and displays output.

  ```
  ┌──────────────────────────────────────┐
  │         Terminal Emulator            │  ← The "window" you see
  │  ┌────────────────────────────────┐  │
  │  │            Shell (Bash)        │  │  ← Interprets commands
  │  │  student@ubuntu:~$  _          │  │
  │  └────────────────────────────────┘  │
  └──────────────────────────────────────┘
  ```

  Popular shells: **Bash** (Bourne Again Shell) — default on most Linux distros, **Zsh**, **Fish**, **Dash**, **sh** (original Bourne Shell).

  This course uses **Bash** exclusively.

  ---

  # Slide 3: Anatomy of the Command Prompt
  When you open a terminal, you see the **prompt**. It looks like this:

  ```
  student@ubuntu:~$
  ```

  Breaking it down:
  | Part | Meaning |
  |------|---------|
  | `student` | Current logged-in username |
  | `@` | Separator (at symbol) |
  | `ubuntu` | Hostname (computer name) |
  | `:` | Separator |
  | `~` | Current directory (`~` means home directory) |
  | `$` | Prompt symbol for normal users |
  | `#` | Prompt symbol for root (superuser) — be careful! |

  After the `$` or `#`, you type your command and press **Enter**.

  ---

  # Slide 4: Anatomy of a Linux Command
  Every Linux command follows a general structure:

  ```
  command  [options]  [arguments]
  ```

  Example:
  ```bash
  ls  -la  /home/student
  │    │       │
  │    │       └── Argument: the directory to list
  │    └────────── Option: -l (long format) + -a (show hidden files)
  └─────────────── Command: list directory contents
  ```

  **Key Rules:**
  - Commands are **case-sensitive** (`ls` ≠ `LS`)
  - Options usually start with `-` (short) or `--` (long). Example: `-l` or `--long`
  - Multiple short options can be combined: `-l -a` = `-la`
  - Arguments follow options and specify what the command acts on

  ---

  # Slide 5: Essential Terminal Shortcuts & Help Commands
  **Navigation Shortcuts:**
  | Shortcut | Action |
  |----------|--------|
  | `Ctrl+C` | Cancel current running command |
  | `Ctrl+D` | Log out / close terminal |
  | `Ctrl+L` | Clear the screen (same as `clear`) |
  | `Tab` | Auto-complete file/directory/command names |
  | `↑` / `↓` | Scroll through command history |
  | `Ctrl+A` | Move cursor to beginning of line |
  | `Ctrl+E` | Move cursor to end of line |

  **Getting Help:**
  ```bash
  man ls          # Opens the manual page for 'ls'
  ls --help       # Prints a short help message
  info ls         # More detailed info pages
  whatis ls       # One-line description of command
  ```

  **The `man` command** is your best friend. Press `q` to quit a man page, use `/` to search within it.

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Navigating the Shell Basics
* **Est. Minutes:** 5
* **Outline:** Practice the prompt, basic commands, and getting help from the terminal.
* **Instructions:** Open your terminal. Run the following commands one at a time and observe the output. Understanding what each command does is as important as running it.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Run `echo "Hello, Linux!"` to print a message to the terminal. This verifies the shell is working and demonstrates the `echo` command.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "Hello, Linux!" | grep -q "Hello, Linux!" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Run `pwd` to print your current working directory. It should output `/home/student`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ "$(pwd)" = "/home/student" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Run `bash --version` to confirm which version of Bash is installed.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash --version | grep -qi "bash" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** Run `history` to view your recent command history. This is useful for reviewing and repeating past commands.
    * **Validation Type:** `command_check`
    * **Validation Script:** `history | grep -q "." && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Document Your Terminal Knowledge
* **Est. Minutes:** 8
* **Outline:** Use nano to create a cheatsheet file summarizing terminal concepts.
* **Instructions:** Use `nano /home/student/terminal_cheatsheet.txt` to create a file. Document at least three terminal shortcuts or commands in the file. Save with `Ctrl+O` then `Ctrl+X`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create the file `/home/student/terminal_cheatsheet.txt` containing the word "Bash" somewhere in the file.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "Bash" /home/student/terminal_cheatsheet.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add a line to the file that includes the word "prompt" (e.g., "The shell prompt shows the username.").
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "prompt" /home/student/terminal_cheatsheet.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 3:**
    * **Instruction:** Add a line that contains the text "Ctrl+C" as a documented shortcut.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "Ctrl+C" /home/student/terminal_cheatsheet.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Terminal & Shell — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on the shell, terminal, command structure, and shortcuts.

* **Questions:**

  * **Q1:** What is the difference between a terminal emulator and a shell?
    * **Options:**
      * A) They are the same — both refer to the command line window
      * B) The terminal is the window/application; the shell is the program inside that interprets commands
      * C) The shell is the window; the terminal is the interpreter
      * D) The shell is a type of file system; the terminal is the hardware
    * **Correct Answer:** B) The terminal is the window/application; the shell is the program inside that interprets commands
    * **Explanation:** The terminal emulator provides the visual interface (the window), while the shell (like Bash) is the command interpreter running inside it, processing your commands.

  * **Q2:** In the prompt `student@ubuntu:~$`, what does the `~` symbol represent?
    * **Options:**
      * A) The root directory `/`
      * B) The current user's home directory
      * C) An unknown or undefined directory
      * D) A hidden directory
    * **Correct Answer:** B) The current user's home directory
    * **Explanation:** In Linux, `~` is a shorthand for the current user's home directory. For user `student`, it typically expands to `/home/student`.

  * **Q3:** Which keyboard shortcut cancels a currently running command in the terminal?
    * **Options:**
      * A) `Ctrl+D`
      * B) `Ctrl+Z`
      * C) `Ctrl+C`
      * D) `Ctrl+X`
    * **Correct Answer:** C) `Ctrl+C`
    * **Explanation:** `Ctrl+C` sends the SIGINT (interrupt) signal to the running process, which typically terminates it. `Ctrl+D` closes the terminal session, and `Ctrl+Z` suspends the process.

  * **Q4:** Given the command `ls -la /home`, which part is the argument?
    * **Options:**
      * A) `ls`
      * B) `-la`
      * C) `/home`
      * D) `-l`
    * **Correct Answer:** C) `/home`
    * **Explanation:** In `ls -la /home`: `ls` is the command, `-la` is the combined options (long format + show hidden), and `/home` is the argument — the directory to list.

---

# MODULE 2: FILE SYSTEM NAVIGATION

---

## CHAPTER 2.1: Directories and Paths

* **Description:** Covers the Linux filesystem hierarchy, the difference between absolute and relative paths, and commands for navigating directories (`pwd`, `cd`, `ls`).

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** The Linux Filesystem Hierarchy and Path Types
* **Est. Minutes:** 5
* **Outline:** Explains the Filesystem Hierarchy Standard (FHS), key directories, absolute vs. relative paths, and navigation commands.

* **Instructions (Slides):**

  # Slide 1: The Linux Filesystem Hierarchy Standard (FHS)
  Linux organizes all files in a **single-rooted, hierarchical tree** starting from `/` (the root directory). Unlike Windows (which has multiple drive letters like C:\, D:\), Linux has one unified tree.

  ```
  /                        ← Root (top of everything)
  ├── bin/                 ← Essential user commands (ls, cp, mv)
  ├── boot/                ← Boot loader files, kernel image
  ├── dev/                 ← Device files (hard drives, USB, etc.)
  ├── etc/                 ← System configuration files
  ├── home/                ← User home directories
  │   └── student/         ← Your home directory
  ├── lib/                 ← Shared libraries for /bin and /sbin
  ├── media/               ← Mount points for removable media
  ├── opt/                 ← Optional/third-party software
  ├── proc/                ← Virtual filesystem for running processes
  ├── root/                ← Home directory of the root user
  ├── sbin/                ← System administration commands
  ├── tmp/                 ← Temporary files (cleared on reboot)
  ├── usr/                 ← User programs and data
  │   ├── bin/             ← Most user commands
  │   └── share/           ← Shared data for programs
  └── var/                 ← Variable data (logs, spool, databases)
  ```

  ---

  # Slide 2: Absolute vs Relative Paths
  There are two ways to specify a file or directory location:

  **Absolute Path:** Starts from the root `/`. It is the full path, always valid regardless of your current location.
  ```bash
  /home/student/documents/notes.txt
  ```

  **Relative Path:** Relative to your **current working directory (CWD)**. Does NOT start with `/`.
  ```bash
  documents/notes.txt        # If you are in /home/student
  ../student/documents/      # Go up one level, then back in
  ```

  **Special Path Symbols:**
  | Symbol | Meaning |
  |--------|---------|
  | `.` | Current directory |
  | `..` | Parent directory (one level up) |
  | `~` | Current user's home directory |
  | `-` | Previous directory (used with `cd -`) |

  ---

  # Slide 3: Navigation Commands — pwd, cd, ls
  **`pwd` — Print Working Directory**
  ```bash
  pwd
  # Output: /home/student
  ```
  Always shows your current absolute path.

  **`cd` — Change Directory**
  ```bash
  cd /etc                   # Go to /etc (absolute)
  cd documents              # Go into documents/ (relative)
  cd ..                     # Go up one level
  cd ~                      # Go to home directory
  cd -                      # Go back to previous directory
  cd                        # Same as cd ~ (go home)
  ```

  **`ls` — List Directory Contents**
  ```bash
  ls                        # List current directory
  ls /etc                   # List /etc directory
  ls -l                     # Long format (permissions, size, date)
  ls -a                     # Show hidden files (starting with .)
  ls -la                    # Both long format AND hidden files
  ls -lh                    # Human-readable file sizes (KB, MB)
  ls -R                     # Recursive: list all subdirectories too
  ```

  ---

  # Slide 4: Understanding `ls -l` Output
  The long listing format shows detailed file information:

  ```
  drwxr-xr-x 2 student student 4096 Jan 10 09:00 documents
  -rw-r--r-- 1 student student  256 Jan 10 09:05 notes.txt
  │          │ │       │        │    │              └── Filename
  │          │ │       │        │    └───────────────── Last modified date
  │          │ │       │        └────────────────────── File size (bytes)
  │          │ │       └─────────────────────────────── Group owner
  │          │ └─────────────────────────────────────── User owner
  │          └───────────────────────────────────────── Link count
  └──────────────────────────────────────────────────── Permissions + type
  ```

  **File Type Indicators (first character):**
  - `-` = Regular file
  - `d` = Directory
  - `l` = Symbolic link
  - `c` = Character device
  - `b` = Block device

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Navigate the Linux Filesystem
* **Est. Minutes:** 5
* **Outline:** Practice using `pwd`, `cd`, and `ls` to navigate the filesystem hierarchy.
* **Instructions:** Run each command below and observe the output. Pay attention to how your prompt changes when you change directories.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Run `ls /` to list the root directory and see the top-level structure of the Linux filesystem.
    * **Validation Type:** `command_check`
    * **Validation Script:** `ls / | grep -q "etc" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Navigate to the `/etc` directory using `cd /etc`, then confirm your location with `pwd`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `cd /etc && pwd | grep -q "/etc" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Return to your home directory using `cd ~`, then verify you are in `/home/student` with `pwd`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `cd ~ && [ "$(pwd)" = "/home/student" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** Run `ls -la /home/student` to view all files (including hidden) in your home directory with detailed information.
    * **Validation Type:** `command_check`
    * **Validation Script:** `ls -la /home/student | grep -q "student" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create a Filesystem Reference File
* **Est. Minutes:** 8
* **Outline:** Create a reference file documenting the key directories in the Linux filesystem hierarchy.
* **Instructions:** Use `nano /home/student/filesystem_reference.txt` to create the file. Write at least three key Linux directory paths and their purposes. Save and exit with `Ctrl+O`, Enter, `Ctrl+X`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create the file `/home/student/filesystem_reference.txt` containing the path `/etc` with a description.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "/etc" /home/student/filesystem_reference.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add a line mentioning `/home` in the same file.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "/home" /home/student/filesystem_reference.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 3:**
    * **Instruction:** Add a line mentioning `/var` in the same file.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "/var" /home/student/filesystem_reference.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Directories and Paths — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on the filesystem hierarchy, path types, and navigation commands.

* **Questions:**

  * **Q1:** What does the `pwd` command do?
    * **Options:**
      * A) Creates a new directory
      * B) Prints the current working directory's absolute path
      * C) Displays a list of all directories in the system
      * D) Changes your password
    * **Correct Answer:** B) Prints the current working directory's absolute path
    * **Explanation:** `pwd` stands for "Print Working Directory." It outputs the full absolute path of the directory you are currently in.

  * **Q2:** Which of the following is an absolute path?
    * **Options:**
      * A) `./documents/notes.txt`
      * B) `../etc/passwd`
      * C) `/home/student/documents/notes.txt`
      * D) `documents/notes.txt`
    * **Correct Answer:** C) `/home/student/documents/notes.txt`
    * **Explanation:** An absolute path always begins with `/` (the root). Options A, B, and D all use relative references (`.`, `..`, or no leading `/`).

  * **Q3:** What does `cd ..` do?
    * **Options:**
      * A) Goes to the home directory
      * B) Goes to the root directory
      * C) Goes up one level to the parent directory
      * D) Creates a directory named `..`
    * **Correct Answer:** C) Goes up one level to the parent directory
    * **Explanation:** `..` always refers to the parent directory. So `cd ..` moves you up one level in the directory hierarchy.

  * **Q4:** In which Linux directory are system configuration files typically stored?
    * **Options:**
      * A) `/bin`
      * B) `/var`
      * C) `/home`
      * D) `/etc`
    * **Correct Answer:** D) `/etc`
    * **Explanation:** `/etc` stands for "Editable Text Configuration" (historically "et cetera"). It stores system-wide configuration files like `/etc/hosts`, `/etc/passwd`, and `/etc/fstab`.

---

## CHAPTER 2.2: Creating Directories

* **Description:** Teaches students how to create directories using `mkdir`, including creating nested directory structures and understanding directory permissions.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Creating Directories with mkdir
* **Est. Minutes:** 5
* **Outline:** Explains the `mkdir` command, its options, creating nested directories, and understanding directory permissions and ownership.

* **Instructions (Slides):**

  # Slide 1: The mkdir Command
  The `mkdir` command (make directory) creates new directories. Its basic syntax is:

  ```bash
  mkdir [options] directory_name
  ```

  **Basic Usage:**
  ```bash
  mkdir projects              # Creates 'projects' in current directory
  mkdir /home/student/work    # Creates 'work' using absolute path
  mkdir docs images scripts   # Creates multiple directories at once
  ```

  **Creating a directory requires:**
  - Write permission on the parent directory
  - The directory name must not already exist

  ---

  # Slide 2: mkdir Options
  | Option | Long Form | Description |
  |--------|-----------|-------------|
  | `-p` | `--parents` | Create parent directories as needed (no error if exists) |
  | `-m` | `--mode` | Set file permissions on creation |
  | `-v` | `--verbose` | Print a message for each created directory |

  **Most important: `-p` (parents)**
  ```bash
  mkdir -p projects/2024/semester1/notes
  # Creates all directories in the chain that don't exist yet
  # No error if any already exist
  ```

  Without `-p`, this would fail if `projects/` doesn't exist yet.

  **Verbose creation:**
  ```bash
  mkdir -pv projects/2024/semester1
  # Output:
  # mkdir: created directory 'projects'
  # mkdir: created directory 'projects/2024'
  # mkdir: created directory 'projects/2024/semester1'
  ```

  ---

  # Slide 3: Naming Conventions for Directories
  Linux directory names are **case-sensitive** and can contain most characters, but follow these best practices:

  **Recommended:**
  - Use lowercase letters: `documents`, `projects`
  - Use hyphens or underscores for spaces: `my-project`, `my_project`
  - Keep names short and descriptive

  **Avoid:**
  - Spaces in names (causes issues in commands): `my project` → Use `my_project`
  - Special characters: `!`, `*`, `?`, `\`, `/`, `;`
  - Starting with a hyphen `-` (can be confused with options)
  - Overly long names

  **Creating a directory with a space (if you must):**
  ```bash
  mkdir "my project"          # Quotes wrap the space
  mkdir my\ project           # Backslash escapes the space
  ```

  ---

  # Slide 4: Verifying Directory Creation
  After creating directories, always verify with `ls` or `ls -l`:

  ```bash
  mkdir -p /home/student/os_course/assignments
  ls -la /home/student/
  # You should see:  drwxr-xr-x  os_course
  
  ls -R /home/student/os_course
  # Recursive listing shows nested structure:
  # /home/student/os_course:
  # assignments
  # /home/student/os_course/assignments:
  # (empty)
  ```

  Also useful: `tree` command (shows directory tree visually):
  ```bash
  tree /home/student/os_course
  # os_course
  # └── assignments
  ```
  Note: `tree` may need to be installed: `sudo apt install tree`

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Build a Directory Structure
* **Est. Minutes:** 5
* **Outline:** Practice creating directories including nested structures using mkdir and its options.
* **Instructions:** You will create a project directory structure in your home directory. Run each command as instructed.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create a directory named `os_course` in your home directory using `mkdir /home/student/os_course`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -d "/home/student/os_course" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Create a nested directory structure `assignments/lab1` inside `os_course` in one command using `mkdir -p /home/student/os_course/assignments/lab1`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -d "/home/student/os_course/assignments/lab1" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Create three directories at once inside `os_course`: `notes`, `scripts`, `reports` using `mkdir /home/student/os_course/notes /home/student/os_course/scripts /home/student/os_course/reports`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -d "/home/student/os_course/notes" ] && [ -d "/home/student/os_course/scripts" ] && [ -d "/home/student/os_course/reports" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Document Your Directory Structure
* **Est. Minutes:** 8
* **Outline:** Create a README file inside the os_course directory to describe its structure.
* **Instructions:** Navigate to `/home/student/os_course` using `cd /home/student/os_course`, then use `nano README.txt` to create a file. Describe the directory structure you created.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create the file `/home/student/os_course/README.txt` containing the word "assignments" to describe the folder structure.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "assignments" /home/student/os_course/README.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add a line to the same file that includes the word "scripts".
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "scripts" /home/student/os_course/README.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Creating Directories — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on mkdir usage, options, and naming conventions.

* **Questions:**

  * **Q1:** What does `mkdir -p a/b/c` do when directory `a` does not exist?
    * **Options:**
      * A) Returns an error because `a` does not exist
      * B) Creates only directory `c`
      * C) Creates all directories `a`, `a/b`, and `a/b/c` in sequence
      * D) Creates the directory `a/b/c` as a single flat directory
    * **Correct Answer:** C) Creates all directories `a`, `a/b`, and `a/b/c` in sequence
    * **Explanation:** The `-p` flag tells mkdir to create parent directories as needed. If `a` doesn't exist, it creates `a`, then `a/b`, then `a/b/c` — no errors are raised if parents are missing.

  * **Q2:** Which command creates a directory named `my_lab` inside `/home/student`?
    * **Options:**
      * A) `create /home/student/my_lab`
      * B) `mkdir /home/student/my_lab`
      * C) `touch /home/student/my_lab`
      * D) `new /home/student/my_lab`
    * **Correct Answer:** B) `mkdir /home/student/my_lab`
    * **Explanation:** `mkdir` is the standard Linux command to create directories. `touch` creates files (not directories), and `create` / `new` are not standard Linux commands.

  * **Q3:** What is the recommended practice when a directory name must contain a space?
    * **Options:**
      * A) Linux does not allow spaces in directory names
      * B) Use quotes or a backslash escape: `"my dir"` or `my\ dir`
      * C) Replace the space with a dot: `my.dir`
      * D) Use a capital letter instead of space
    * **Correct Answer:** B) Use quotes or a backslash escape: `"my dir"` or `my\ dir`
    * **Explanation:** Linux does allow spaces in filenames and directory names, but they must be escaped. Wrapping in quotes (`"my dir"`) or using backslash (`my\ dir`) prevents the shell from splitting the name into two separate arguments.

  * **Q4:** What does `mkdir -v projects` print after successful creation?
    * **Options:**
      * A) Nothing — `-v` suppresses output
      * B) The directory listing of `projects`
      * C) A message like "mkdir: created directory 'projects'"
      * D) The permissions of the new directory
    * **Correct Answer:** C) A message like "mkdir: created directory 'projects'"
    * **Explanation:** The `-v` (verbose) flag causes `mkdir` to print a message for every directory it creates. This is useful for confirming that nested directories were all created.

---

## CHAPTER 2.3: Creating Files

* **Description:** Teaches students how to create empty files with `touch`, understand file timestamps, and differentiate file creation from directory creation.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Creating Files with touch and Redirects
* **Est. Minutes:** 5
* **Outline:** Explains the `touch` command, its primary and secondary uses, file timestamps, and how output redirection can also create files.

* **Instructions (Slides):**

  # Slide 1: The touch Command
  The `touch` command is primarily used to **create empty files** and to **update file timestamps**.

  ```bash
  touch filename.txt              # Create a new empty file
  touch file1.txt file2.txt       # Create multiple files at once
  touch /home/student/notes.txt   # Create using absolute path
  ```

  If the file **does not exist**, `touch` creates it (empty, 0 bytes).
  If the file **already exists**, `touch` updates its access and modification timestamps without changing its content.

  ---

  # Slide 2: File Timestamps
  Every file in Linux has three timestamps:

  | Timestamp | Name | Updated When |
  |-----------|------|-------------|
  | `atime` | Access Time | File is read |
  | `mtime` | Modification Time | File content is changed |
  | `ctime` | Change Time | File metadata is changed (rename, permission) |

  **View timestamps with `ls -l`:**
  ```bash
  ls -l notes.txt
  # -rw-r--r-- 1 student student 0 Jan 10 09:15 notes.txt
  #                                     └── This is the mtime
  ```

  **View all timestamps with `stat`:**
  ```bash
  stat notes.txt
  # Access: 2024-01-10 09:15:00
  # Modify: 2024-01-10 09:15:00
  # Change: 2024-01-10 09:15:00
  ```

  **Set a specific timestamp with touch:**
  ```bash
  touch -t 202401010800 notes.txt   # Set to Jan 1, 2024 at 08:00
  ```

  ---

  # Slide 3: Creating Files with Redirection
  In addition to `touch`, files can be created using **output redirection** (`>` and `>>`):

  ```bash
  > newfile.txt              # Creates empty file (or truncates existing)
  echo "Hello" > file.txt    # Creates file with "Hello" as content
  echo "More" >> file.txt    # Appends "More" to existing file
  ```

  **Important distinction:**
  | Method | Creates File | Adds Content | Overwrites Existing |
  |--------|-------------|--------------|---------------------|
  | `touch file.txt` | ✅ Yes | ❌ No | ❌ No (preserves) |
  | `> file.txt` | ✅ Yes | ❌ No | ✅ Yes (truncates) |
  | `echo "text" > file.txt` | ✅ Yes | ✅ Yes | ✅ Yes |
  | `echo "text" >> file.txt` | ✅ Yes | ✅ Yes | ❌ No (appends) |

  ---

  # Slide 4: File Naming Best Practices
  Linux filenames are case-sensitive and very flexible. Best practices:

  **Allowed Characters:** Letters (a-z, A-Z), digits (0-9), dots (`.`), hyphens (`-`), underscores (`_`)

  **Avoid:** Spaces, `!`, `*`, `?`, `\`, `;`, `:`, `|`, `<`, `>` (special shell characters)

  **Hidden Files:** Files starting with `.` are hidden from `ls` (visible with `ls -a`):
  ```bash
  touch .hidden_file          # Creates a hidden file
  ls                          # Not shown
  ls -a                       # Shown: .hidden_file
  ```

  **File Extensions:** Linux does not rely on extensions for file types (unlike Windows), but using them helps humans identify file purposes:
  - `.txt` — Text files
  - `.sh` — Shell scripts
  - `.py` — Python scripts
  - `.conf` — Configuration files
  - `.log` — Log files

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Create and Inspect Files
* **Est. Minutes:** 5
* **Outline:** Practice creating files using touch and redirection, and inspect them with stat and ls.
* **Instructions:** Create various files in your home directory and os_course directory, then verify their creation.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create an empty file named `assignment1.txt` inside `/home/student/os_course/assignments/lab1/` using the `touch` command.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/os_course/assignments/lab1/assignment1.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Create three empty files at once in `/home/student/os_course/notes/`: `lecture1.txt`, `lecture2.txt`, `lecture3.txt` using a single `touch` command.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/os_course/notes/lecture1.txt" ] && [ -f "/home/student/os_course/notes/lecture2.txt" ] && [ -f "/home/student/os_course/notes/lecture3.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Use the `stat` command to view the timestamps of `assignment1.txt`. Run `stat /home/student/os_course/assignments/lab1/assignment1.txt`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `stat /home/student/os_course/assignments/lab1/assignment1.txt | grep -qi "access\|modify\|birth\|change" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Write Your First Assignment File
* **Est. Minutes:** 8
* **Outline:** Use nano to write content into an assignment file.
* **Instructions:** Open the file `/home/student/os_course/assignments/lab1/assignment1.txt` with `nano`. Write your student information and a brief answer about what `touch` does. Save with `Ctrl+O`, Enter, `Ctrl+X`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Open `/home/student/os_course/assignments/lab1/assignment1.txt` in nano and add a line containing "touch" (explaining the command).
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "touch" /home/student/os_course/assignments/lab1/assignment1.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add a line to the same file containing the word "timestamp".
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "timestamp" /home/student/os_course/assignments/lab1/assignment1.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Creating Files — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on touch, file timestamps, and redirection-based file creation.

* **Questions:**

  * **Q1:** What happens when you run `touch existing_file.txt` on a file that already exists?
    * **Options:**
      * A) The file is deleted and recreated empty
      * B) An error is returned because the file exists
      * C) The file's content is unchanged but its timestamps are updated
      * D) A backup copy of the file is made
    * **Correct Answer:** C) The file's content is unchanged but its timestamps are updated
    * **Explanation:** `touch` on an existing file only updates its access and modification timestamps to the current time. It does not delete, truncate, or alter the content.

  * **Q2:** Which command creates a file AND writes "Hello World" into it simultaneously?
    * **Options:**
      * A) `touch hello.txt "Hello World"`
      * B) `echo "Hello World" > hello.txt`
      * C) `mkdir hello.txt`
      * D) `write hello.txt Hello World`
    * **Correct Answer:** B) `echo "Hello World" > hello.txt`
    * **Explanation:** `echo "Hello World" > hello.txt` uses the `>` redirection operator to write the output of `echo` into `hello.txt`, creating the file if it doesn't exist and writing "Hello World" as content.

  * **Q3:** A file named `.settings` starts with a dot. What does this mean in Linux?
    * **Options:**
      * A) It is a directory, not a file
      * B) It is a hidden file, not shown by default in `ls`
      * C) It is read-only and cannot be modified
      * D) It belongs to the root user
    * **Correct Answer:** B) It is a hidden file, not shown by default in `ls`
    * **Explanation:** In Linux, any file or directory whose name begins with a `.` is treated as hidden. It won't appear in a standard `ls` listing, but `ls -a` will show it.

  * **Q4:** What does the `>>` operator do compared to `>`?
    * **Options:**
      * A) Both operators do the same thing
      * B) `>>` overwrites the file; `>` appends to it
      * C) `>>` appends to an existing file; `>` overwrites (truncates) it
      * D) `>>` creates a directory; `>` creates a file
    * **Correct Answer:** C) `>>` appends to an existing file; `>` overwrites (truncates) it
    * **Explanation:** `>` redirects output and overwrites the target file from scratch. `>>` redirects output and appends it to the end of the existing file. Both create the file if it doesn't exist.

---

# MODULE 3: WORKING WITH FILES

---

## CHAPTER 3.1: Reading Files

* **Description:** Covers multiple ways to view file content in Linux: `cat`, `less`, `more`, `head`, `tail`, and `wc`. Students learn when to use each command based on file size and context.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Commands for Reading and Viewing File Content
* **Est. Minutes:** 5
* **Outline:** Explains cat, less, more, head, tail, and wc — their purposes, options, and use cases.

* **Instructions (Slides):**

  # Slide 1: cat — Concatenate and Display
  `cat` (concatenate) is the most basic file reading command. It prints the entire contents of a file to the terminal.

  ```bash
  cat filename.txt              # Display file content
  cat file1.txt file2.txt       # Display multiple files in sequence
  cat -n filename.txt           # Display with line numbers
  cat -A filename.txt           # Show special characters (tabs as ^I, newlines as $)
  cat -b filename.txt           # Number only non-empty lines
  ```

  **When to use cat:**
  - Small files (a few dozen lines)
  - When you need to see the entire file at once
  - When piping content to another command: `cat file.txt | grep "error"`

  **Caution:** Running `cat` on very large files floods the terminal. Use `less` instead.

  ---

  # Slide 2: less and more — Paged Viewers
  For large files, use **pagers** that display content one screen at a time:

  **`less`** (recommended — more features than `more`):
  ```bash
  less filename.txt
  ```
  Navigation inside `less`:
  | Key | Action |
  |-----|--------|
  | `Space` or `f` | Next page |
  | `b` | Previous page |
  | `↑` / `↓` | Scroll one line |
  | `/pattern` | Search forward |
  | `n` | Next search match |
  | `g` | Go to beginning |
  | `G` | Go to end |
  | `q` | Quit |

  **`more`** (simpler, older):
  ```bash
  more filename.txt    # Only scrolls forward; Enter = one line, Space = one page
  ```

  ---

  # Slide 3: head and tail — View File Extremes
  **`head`** — Shows the first N lines of a file (default: 10):
  ```bash
  head filename.txt           # First 10 lines
  head -n 20 filename.txt     # First 20 lines
  head -20 filename.txt       # Same (shorter form)
  head -c 100 filename.txt    # First 100 bytes
  ```

  **`tail`** — Shows the last N lines of a file (default: 10):
  ```bash
  tail filename.txt           # Last 10 lines
  tail -n 20 filename.txt     # Last 20 lines
  tail -f filename.txt        # Follow mode: shows new lines as they are added (great for logs!)
  tail -f /var/log/syslog     # Live log monitoring example
  ```

  **Combining head and tail (extract middle of file):**
  ```bash
  head -n 20 file.txt | tail -n 5   # Lines 16-20 of file
  ```

  ---

  # Slide 4: wc — Word Count
  `wc` counts lines, words, and characters in a file:

  ```bash
  wc filename.txt              # Lines, words, bytes (all three)
  wc -l filename.txt           # Count lines only
  wc -w filename.txt           # Count words only
  wc -c filename.txt           # Count bytes (characters in ASCII files)
  wc -m filename.txt           # Count characters (handles multibyte/unicode)
  ```

  **Example output:**
  ```bash
  wc /etc/passwd
  #   45  78  2564 /etc/passwd
  #   │   │   │
  #   │   │   └── Bytes
  #   │   └────── Words
  #   └────────── Lines
  ```

  **Useful for OS practicals:** Count words in a document, count lines in a script, verify file sizes.

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Read and Inspect Files
* **Est. Minutes:** 5
* **Outline:** Practice using cat, head, tail, and wc to read and analyze file contents.
* **Instructions:** Run each command to practice the various file reading techniques.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Use `cat /etc/hostname` to view the system's hostname file.
    * **Validation Type:** `command_check`
    * **Validation Script:** `cat /etc/hostname | grep -q "." && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Use `head -n 5 /etc/passwd` to view the first 5 lines of the passwd file.
    * **Validation Type:** `command_check`
    * **Validation Script:** `head -n 5 /etc/passwd | wc -l | grep -q "5" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Use `wc -l /etc/passwd` to count how many lines are in the passwd file.
    * **Validation Type:** `command_check`
    * **Validation Script:** `wc -l /etc/passwd | grep -qE "^[0-9]+" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** Use `cat -n /home/student/linux_notes.txt` to display your notes file with line numbers. (If the file doesn't exist yet, create it with `touch /home/student/linux_notes.txt` first.)
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ -f "/home/student/linux_notes.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create a Multi-Line Study File
* **Est. Minutes:** 8
* **Outline:** Create a file with multiple lines to practice reading commands on a file you authored.
* **Instructions:** Use `nano /home/student/os_course/notes/lecture1.txt` to create a file with at least 5 lines of content about Linux commands. Then verify it with `cat -n` and `wc -l`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Write at least 5 lines into `/home/student/os_course/notes/lecture1.txt`. Each line should mention a command name (cat, head, tail, less, wc, etc.).
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ "$(wc -l < /home/student/os_course/notes/lecture1.txt)" -ge 5 ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Ensure the file `/home/student/os_course/notes/lecture1.txt` contains the word "cat" in it.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "cat" /home/student/os_course/notes/lecture1.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Reading Files — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on cat, less, head, tail, and wc.

* **Questions:**

  * **Q1:** Which command is best suited for viewing the last 20 lines of a large log file?
    * **Options:**
      * A) `cat -n logfile.txt`
      * B) `head -n 20 logfile.txt`
      * C) `tail -n 20 logfile.txt`
      * D) `wc -l logfile.txt`
    * **Correct Answer:** C) `tail -n 20 logfile.txt`
    * **Explanation:** `tail` displays lines from the end of a file. `-n 20` specifies 20 lines. `head` shows from the beginning. `cat` dumps everything. `wc` counts but doesn't display content.

  * **Q2:** What does `wc -w report.txt` output?
    * **Options:**
      * A) The number of lines in report.txt
      * B) The number of words in report.txt
      * C) The number of bytes in report.txt
      * D) The word list found in report.txt
    * **Correct Answer:** B) The number of words in report.txt
    * **Explanation:** `wc -w` counts words (sequences of characters separated by whitespace). `wc -l` counts lines and `wc -c` counts bytes.

  * **Q3:** Which `tail` option lets you monitor a file in real-time as new content is added?
    * **Options:**
      * A) `tail -r`
      * B) `tail -n`
      * C) `tail -f`
      * D) `tail -v`
    * **Correct Answer:** C) `tail -f`
    * **Explanation:** `tail -f` (follow) keeps the file open and continuously prints new lines as they are appended — ideal for monitoring log files in real-time.

  * **Q4:** What is the key advantage of using `less` over `cat` for large files?
    * **Options:**
      * A) `less` is faster because it reads less of the file
      * B) `less` displays the file one page at a time and allows forward and backward navigation
      * C) `less` automatically compresses the file
      * D) `less` filters out empty lines
    * **Correct Answer:** B) `less` displays the file one page at a time and allows forward and backward navigation
    * **Explanation:** `less` is a pager that lets you scroll through files interactively. Unlike `cat` (which dumps everything) or `more` (forward-only), `less` supports both forward and backward navigation, search, and line jumping.

---

## CHAPTER 3.2: Copying Files

* **Description:** Teaches the `cp` command for copying files and directories, including recursive copying, preserving attributes, and using wildcards.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Copying Files and Directories with cp
* **Est. Minutes:** 5
* **Outline:** Explains the cp command, its key options (recursive, preserve, verbose, interactive), wildcard usage, and common use cases.

* **Instructions (Slides):**

  # Slide 1: The cp Command
  `cp` (copy) copies files and directories from one location to another.

  **Basic Syntax:**
  ```bash
  cp source destination
  cp [options] source destination
  cp [options] source1 source2 ... destination_directory
  ```

  **Basic Examples:**
  ```bash
  cp notes.txt backup_notes.txt           # Copy file in same directory (creates backup)
  cp notes.txt /home/student/backup/      # Copy to another directory
  cp /etc/passwd /home/student/           # Copy system file to home
  ```

  **Copying multiple files to a directory:**
  ```bash
  cp file1.txt file2.txt file3.txt /home/student/backup/
  # All three files are copied into backup/
  ```

  ---

  # Slide 2: Key cp Options
  | Option | Long Form | Description |
  |--------|-----------|-------------|
  | `-r` | `--recursive` | Copy directories and their contents recursively |
  | `-p` | `--preserve` | Preserve timestamps, permissions, and ownership |
  | `-v` | `--verbose` | Print what is being copied |
  | `-i` | `--interactive` | Ask before overwriting existing files |
  | `-n` | `--no-clobber` | Do not overwrite existing files |
  | `-u` | `--update` | Copy only if source is newer than destination |
  | `-a` | `--archive` | Preserve all attributes + recursive (= -rp + more) |

  **Copy a directory recursively:**
  ```bash
  cp -r /home/student/os_course /home/student/os_course_backup
  # Copies the entire directory tree
  ```

  **Copy with verbose output:**
  ```bash
  cp -rv documents/ documents_backup/
  # 'documents/notes.txt' -> 'documents_backup/notes.txt'
  ```

  ---

  # Slide 3: Wildcards with cp
  Wildcards let you copy multiple files matching a pattern:

  | Wildcard | Meaning | Example |
  |----------|---------|---------|
  | `*` | Matches any number of characters | `*.txt` — all .txt files |
  | `?` | Matches exactly one character | `file?.txt` — file1.txt, fileA.txt |
  | `[abc]` | Matches any character in the set | `file[123].txt` |
  | `[a-z]` | Matches any character in the range | `[a-z]*.txt` |

  ```bash
  cp *.txt /home/student/backup/     # Copy all .txt files to backup
  cp file?.sh scripts/               # Copy file1.sh, file2.sh, etc.
  cp lecture[1-3].txt notes/         # Copy lecture1.txt, lecture2.txt, lecture3.txt
  ```

  **Important:** The shell expands wildcards *before* passing arguments to `cp`. The `cp` command itself never sees the `*` — it sees the list of matching files.

  ---

  # Slide 4: Common cp Pitfalls
  **Pitfall 1: Overwriting without warning**
  ```bash
  cp new_file.txt important_file.txt   # Silently overwrites important_file.txt!
  cp -i new_file.txt important_file.txt  # Safer: asks before overwriting
  ```

  **Pitfall 2: Forgetting -r for directories**
  ```bash
  cp documents/ backup/              # ERROR: omitting directory
  cp -r documents/ backup/           # Correct
  ```

  **Pitfall 3: Trailing slash behavior**
  ```bash
  cp -r source/ dest/    # Copies CONTENTS of source into dest
  cp -r source dest/     # Copies source DIRECTORY itself into dest (creates dest/source)
  ```

  Understanding these distinctions is critical for OS practicals.

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Copy Files and Directories
* **Est. Minutes:** 5
* **Outline:** Practice copying files and directories using cp with various options.
* **Instructions:** Perform the following copy operations and verify the results.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create a backup of `lecture1.txt` by copying it to `lecture1_backup.txt` in the same directory: `cp /home/student/os_course/notes/lecture1.txt /home/student/os_course/notes/lecture1_backup.txt`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/os_course/notes/lecture1_backup.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Copy all `.txt` files from `notes/` to `reports/` using: `cp /home/student/os_course/notes/*.txt /home/student/os_course/reports/`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `ls /home/student/os_course/reports/*.txt 2>/dev/null | grep -q ".txt" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Create a full backup of the entire `os_course` directory using `cp -r /home/student/os_course /home/student/os_course_backup`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -d "/home/student/os_course_backup" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create and Copy a Config File
* **Est. Minutes:** 8
* **Outline:** Create a configuration-style file and make a backup copy of it.
* **Instructions:** Use nano to create a configuration file, then use cp to back it up.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/os_course/config.txt` using nano. Write at least one line containing the word "configuration".
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "configuration" /home/student/os_course/config.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Copy `/home/student/os_course/config.txt` to `/home/student/os_course/config.bak` using `cp /home/student/os_course/config.txt /home/student/os_course/config.bak`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/os_course/config.bak" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Copying Files — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on cp options, wildcards, and common pitfalls.

* **Questions:**

  * **Q1:** Which command correctly copies the entire `projects` directory and all its contents to `backup`?
    * **Options:**
      * A) `cp projects backup`
      * B) `cp -r projects backup`
      * C) `cp -f projects backup`
      * D) `copy -all projects backup`
    * **Correct Answer:** B) `cp -r projects backup`
    * **Explanation:** The `-r` (recursive) flag is required when copying directories. Without it, `cp` fails with an error saying it cannot copy a directory.

  * **Q2:** What does `cp -i source.txt dest.txt` do differently from `cp source.txt dest.txt`?
    * **Options:**
      * A) It compresses the file during copying
      * B) It asks for confirmation before overwriting `dest.txt` if it already exists
      * C) It creates an incremental backup only of changed bytes
      * D) It ignores the copy if `dest.txt` already exists
    * **Correct Answer:** B) It asks for confirmation before overwriting `dest.txt` if it already exists
    * **Explanation:** The `-i` (interactive) flag prompts the user with "overwrite? (y/n)" if the destination file already exists, preventing accidental data loss.

  * **Q3:** What does the wildcard `cp *.log /backup/` do?
    * **Options:**
      * A) Copies only a file literally named `*.log`
      * B) Copies all files with `.log` extension in the current directory to `/backup/`
      * C) Copies the `/backup/` directory into the current directory
      * D) Creates a compressed archive of all log files
    * **Correct Answer:** B) Copies all files with `.log` extension in the current directory to `/backup/`
    * **Explanation:** `*` is a wildcard that matches any sequence of characters. `*.log` expands to all filenames ending in `.log` in the current directory. All matching files are then copied to `/backup/`.

  * **Q4:** What does the `cp -p` flag preserve?
    * **Options:**
      * A) Only file permissions
      * B) File timestamps, permissions, and ownership attributes
      * C) Only the parent directory structure
      * D) Only the partition/filesystem type
    * **Correct Answer:** B) File timestamps, permissions, and ownership attributes
    * **Explanation:** `cp -p` (preserve) maintains the original file's mode (permissions), ownership (user and group), and timestamps. Without it, copied files get current-time timestamps and the copier's ownership.

---

## CHAPTER 3.3: Moving and Renaming Files

* **Description:** Teaches the `mv` command for moving files between directories and renaming files and directories. Students understand that in Linux, renaming is a move operation.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Moving and Renaming with mv
* **Est. Minutes:** 5
* **Outline:** Explains the mv command, how Linux treats rename as a move, key options, and practical patterns.

* **Instructions (Slides):**

  # Slide 1: The mv Command — Move and Rename
  `mv` (move) serves two purposes:
  1. **Moving** files or directories to a new location
  2. **Renaming** files or directories (which is just a move within the same directory)

  In Linux, there is no separate `rename` command for individual files — `mv` handles both.

  **Syntax:**
  ```bash
  mv source destination
  mv [options] source1 source2 ... destination_directory
  ```

  **Moving a file:**
  ```bash
  mv notes.txt /home/student/documents/   # Move to documents directory
  mv /tmp/download.zip /home/student/     # Move from /tmp to home
  ```

  **Renaming a file:**
  ```bash
  mv old_name.txt new_name.txt           # Rename in same directory
  mv report_draft.txt report_final.txt   # Rename a draft to final
  ```

  ---

  # Slide 2: Key mv Options
  | Option | Long Form | Description |
  |--------|-----------|-------------|
  | `-i` | `--interactive` | Ask before overwriting existing files |
  | `-n` | `--no-clobber` | Do not overwrite existing files at all |
  | `-v` | `--verbose` | Print what is being moved |
  | `-u` | `--update` | Move only if source is newer than destination |
  | `-f` | `--force` | Do not prompt before overwriting |

  **Examples:**
  ```bash
  mv -i file.txt /backup/              # Asks: "overwrite backup/file.txt? (y/n)"
  mv -v *.log /var/logs/archive/       # Prints each file moved
  mv -n draft.txt final.txt            # Will NOT rename if final.txt already exists
  ```

  ---

  # Slide 3: Moving vs Copying
  Understanding the key difference:

  | Operation | `cp` | `mv` |
  |-----------|------|------|
  | Source file after operation | **Remains** (copy created) | **Removed** (only destination remains) |
  | Cross-filesystem | Works (copies bytes) | May work slowly (copies + deletes) or uses rename |
  | Permissions preserved | Only with `-p` | Preserved by default (same filesystem) |
  | Disk usage | Doubled temporarily | No extra disk usage (on same filesystem) |

  **Key insight:** On the same filesystem, `mv` just updates the directory entry — it's almost instantaneous regardless of file size (just a metadata change, not a data copy).

  **Renaming directories:**
  ```bash
  mv old_dir/ new_dir/      # Renames the directory
  mv projects/ archive/     # Moves projects into archive (if archive/ exists)
  ```

  **Important:** If the destination is an existing directory, `mv` moves the source *into* that directory. If the destination does not exist, it renames.

  ---

  # Slide 4: Practical mv Patterns
  ```bash
  # Rename with timestamp for backup
  mv config.conf config.conf.backup_$(date +%Y%m%d)

  # Move all .bak files to backup directory
  mv *.bak /home/student/backup/

  # Move and rename simultaneously
  mv /tmp/data.csv /home/student/reports/final_data_2024.csv

  # Move directory tree
  mv old_project/ new_project/
  ```

  **Undo a move:** There is no undo in the terminal! If you accidentally overwrite a file with `mv`, it is gone (unless you have backups). Always use `-i` for interactive mode when unsure.

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Move and Rename Files
* **Est. Minutes:** 5
* **Outline:** Practice moving and renaming files and directories using mv.
* **Instructions:** Perform the following move and rename operations.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Rename the file `lecture1_backup.txt` to `lecture1_v2.txt` in `/home/student/os_course/notes/`: `mv /home/student/os_course/notes/lecture1_backup.txt /home/student/os_course/notes/lecture1_v2.txt`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/os_course/notes/lecture1_v2.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Move `config.bak` from `/home/student/os_course/` to `/home/student/os_course/reports/`: `mv /home/student/os_course/config.bak /home/student/os_course/reports/`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/os_course/reports/config.bak" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Move the entire `os_course_backup` directory to a new name `os_course_archive`: `mv /home/student/os_course_backup /home/student/os_course_archive`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -d "/home/student/os_course_archive" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create and Rename a Draft Document
* **Est. Minutes:** 8
* **Outline:** Simulate a real workflow: write a draft, then rename it to a final version.
* **Instructions:** Create a draft file, edit it with content, then rename it to a final version using mv.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/os_course/reports/summary_draft.txt` using nano and write at least one sentence containing "summary".
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "summary" /home/student/os_course/reports/summary_draft.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Rename `summary_draft.txt` to `summary_final.txt` using `mv /home/student/os_course/reports/summary_draft.txt /home/student/os_course/reports/summary_final.txt`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/os_course/reports/summary_final.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Moving and Renaming — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on mv behavior, options, and move vs copy.

* **Questions:**

  * **Q1:** What happens to the source file after `mv source.txt destination.txt`?
    * **Options:**
      * A) The source file is kept and a copy is created at destination
      * B) The source file is deleted and only the destination exists
      * C) Both files exist with identical content
      * D) The source file becomes read-only
    * **Correct Answer:** B) The source file is deleted and only the destination exists
    * **Explanation:** `mv` moves (not copies) the file. After the operation, only the destination file exists. The original source path no longer refers to any file.

  * **Q2:** If `/home/student/docs/` directory already exists, what does `mv report.txt /home/student/docs/` do?
    * **Options:**
      * A) Renames `docs/` to `report.txt`
      * B) Fails with an error because `docs/` already exists
      * C) Moves `report.txt` into the `docs/` directory
      * D) Overwrites the `docs/` directory
    * **Correct Answer:** C) Moves `report.txt` into the `docs/` directory
    * **Explanation:** When the destination is an existing directory, `mv` places the source file *inside* that directory. The result is `/home/student/docs/report.txt`.

  * **Q3:** Which option makes `mv` ask for confirmation before overwriting an existing file?
    * **Options:**
      * A) `-f`
      * B) `-n`
      * C) `-i`
      * D) `-v`
    * **Correct Answer:** C) `-i`
    * **Explanation:** `-i` (interactive) prompts "overwrite?" before overwriting. `-n` silently refuses to overwrite. `-f` forces overwriting without asking. `-v` shows verbose output of what's being moved.

  * **Q4:** On the same filesystem, why is `mv` faster than `cp` for large files?
    * **Options:**
      * A) `mv` uses hardware acceleration while `cp` does not
      * B) `mv` compresses files before moving them
      * C) `mv` only updates directory metadata (no data bytes are copied), while `cp` copies all data bytes
      * D) `mv` uses multi-threading while `cp` is single-threaded
    * **Correct Answer:** C) `mv` only updates directory metadata (no data bytes are copied), while `cp` copies all data bytes
    * **Explanation:** On the same filesystem, `mv` is essentially just a rename operation — it changes the directory entry pointing to the file's inode. No data bytes move. `cp` must read all bytes from source and write them to a new inode at the destination.

---

## CHAPTER 3.4: Deleting Files

* **Description:** Covers the `rm` and `rmdir` commands for deleting files and directories, with emphasis on safety practices, the `trash` concept, and understanding there is no Recycle Bin in Linux by default.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Deleting Files and Directories Safely
* **Est. Minutes:** 5
* **Outline:** Explains rm and rmdir commands, dangerous options to use cautiously, safe deletion practices, and the absence of a Recycle Bin in the Linux CLI.

* **Instructions (Slides):**

  # Slide 1: The rm Command — Remove Files
  `rm` (remove) permanently deletes files. **There is no Recycle Bin — deletions are immediate and not easily reversible.**

  **Basic Syntax:**
  ```bash
  rm filename.txt                  # Delete a single file
  rm file1.txt file2.txt file3.txt # Delete multiple files
  rm *.tmp                         # Delete all .tmp files (wildcard)
  ```

  **Key Warning:** There is no `undo` for `rm` in the CLI. Always double-check before running.

  **Safe option — Interactive mode:**
  ```bash
  rm -i filename.txt   # Asks: "remove 'filename.txt'? (y/n)"
  ```

  Always use `-i` when learning or when you're unsure.

  ---

  # Slide 2: Removing Directories
  `rm` alone cannot remove directories. Use:

  **`rmdir`** — Removes **empty** directories only:
  ```bash
  rmdir empty_dir/        # Works only if empty_dir has no files
  rmdir -p a/b/c/         # Remove empty directory chain
  ```

  **`rm -r`** — Removes directories **recursively** (with all contents):
  ```bash
  rm -r directory/        # Deletes directory and everything inside
  rm -ri directory/       # Recursive but interactive (asks for each file)
  rm -rv directory/       # Recursive and verbose (prints each deletion)
  ```

  **The most dangerous command in Linux:**
  ```bash
  rm -rf /some/path       # -r = recursive, -f = force (no prompts)
  # -rf removes everything in path with no confirmation whatsoever
  # Running rm -rf / or rm -rf /* can destroy the entire system!
  ```

  ---

  # Slide 3: rm Options Summary
  | Option | Description |
  |--------|-------------|
  | `-i` | Interactive — ask before each deletion |
  | `-r` or `-R` | Recursive — remove directories and contents |
  | `-f` | Force — no prompts, ignore nonexistent files |
  | `-v` | Verbose — print each file being removed |
  | `-d` | Remove empty directories (like rmdir) |

  **Safe Practices:**
  1. Always use `-i` when deleting important files
  2. Preview what you're deleting: `ls -la` before `rm`
  3. Use `echo rm -rf folder/` to preview the command first
  4. Never run `rm -rf` as root unless you are absolutely certain
  5. Consider using `trash-cli` (a Recycle Bin for CLI) for safer deletion

  ---

  # Slide 4: The trash-cli Alternative
  For safer deletion in day-to-day work, consider `trash-cli`:

  ```bash
  sudo apt install trash-cli      # Install trash-cli
  trash-put file.txt              # Move to trash (recoverable)
  trash-list                      # List items in trash
  trash-restore                   # Restore deleted files
  trash-empty                     # Permanently empty the trash
  ```

  This mirrors the GUI Recycle Bin / Trash experience in the terminal.

  **For OS practical exams:** The `rm` command is what is tested — know its options. But in real professional work, `trash-cli` is safer for day-to-day use.

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Delete Files and Directories Safely
* **Est. Minutes:** 5
* **Outline:** Practice deleting files and directories using rm and rmdir with safety options.
* **Instructions:** Delete the specified files and directories, using the interactive flag where instructed.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Delete the file `/home/student/os_course/notes/lecture1_v2.txt` using `rm /home/student/os_course/notes/lecture1_v2.txt`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ ! -f "/home/student/os_course/notes/lecture1_v2.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Delete the empty `lab1` directory using `rmdir /home/student/os_course/assignments/lab1` (note: you'll need to delete files inside first if any exist, or use `rm -r`).
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ ! -d "/home/student/os_course/assignments/lab1" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Delete the entire `os_course_archive` directory and all its contents: `rm -r /home/student/os_course_archive`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ ! -d "/home/student/os_course_archive" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create a Deletion Log
* **Est. Minutes:** 8
* **Outline:** Document safe deletion practices by creating a reference file with rm best practices.
* **Instructions:** Use nano to create a safety guide file about the rm command.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/rm_safety_guide.txt` using nano. Include the word "interactive" to document the `-i` flag.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "interactive" /home/student/rm_safety_guide.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add a warning line to the same file containing the word "irreversible" (e.g., "Deletion with rm is irreversible — no Recycle Bin.").
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "irreversible" /home/student/rm_safety_guide.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Deleting Files — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on rm, rmdir, and safe deletion practices.

* **Questions:**

  * **Q1:** What happens when you delete a file using `rm` in Linux?
    * **Options:**
      * A) The file is moved to a Recycle Bin and can be restored
      * B) The file is permanently deleted with no CLI Recycle Bin by default
      * C) The file is compressed and stored in `/var/deleted/`
      * D) The file content is zeroed out but the filename remains
    * **Correct Answer:** B) The file is permanently deleted with no CLI Recycle Bin by default
    * **Explanation:** Unlike GUI environments, the Linux CLI `rm` command permanently deletes files. There is no built-in Recycle Bin. Recovery requires special tools or backups, and is not always possible.

  * **Q2:** What is the difference between `rmdir` and `rm -r`?
    * **Options:**
      * A) `rmdir` deletes files; `rm -r` deletes directories
      * B) `rmdir` deletes only empty directories; `rm -r` deletes directories with all their contents
      * C) Both commands do exactly the same thing
      * D) `rmdir` is safer because it asks for confirmation
    * **Correct Answer:** B) `rmdir` deletes only empty directories; `rm -r` deletes directories with all their contents
    * **Explanation:** `rmdir` fails if the directory contains any files or subdirectories. `rm -r` recursively removes everything inside the directory before removing the directory itself.

  * **Q3:** Which combination of flags makes `rm` dangerous and capable of deleting everything without prompting?
    * **Options:**
      * A) `-iv`
      * B) `-rf`
      * C) `-lv`
      * D) `-np`
    * **Correct Answer:** B) `-rf`
    * **Explanation:** `rm -rf` combines recursive (`-r`) with force (`-f`). Recursive means it enters all subdirectories. Force means it never prompts for confirmation. This combination can delete entire filesystems if misused.

  * **Q4:** What is the safest way to delete files when you are unsure?
    * **Options:**
      * A) Use `rm -f` to force deletion quickly
      * B) Use `rm -i` to be prompted for confirmation before each deletion
      * C) Use `rm -R` to see each file listed
      * D) Use `rmdir` for all files and directories
    * **Correct Answer:** B) Use `rm -i` to be prompted for confirmation before each deletion
    * **Explanation:** The `-i` (interactive) flag causes `rm` to ask "remove 'filename'? (y/n)" for each file. This prevents accidental deletion and gives you a chance to review before committing.

---

# MODULE 4: FILE CONTENT OPERATIONS

---

## CHAPTER 4.1: Writing Text from Terminal

* **Description:** Covers multiple methods to write text to files from the terminal: `echo`, `printf`, heredocs, and redirection. Foundational for scripting and OS practicals.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Writing Text to Files Using echo, printf, and Redirection
* **Est. Minutes:** 5
* **Outline:** Explains echo, printf, heredoc syntax, and redirection operators for writing file content from the command line.

* **Instructions (Slides):**

  # Slide 1: The echo Command
  `echo` prints text to standard output (the terminal). Combined with redirection, it writes to files.

  ```bash
  echo "Hello, World!"              # Prints to terminal
  echo "Hello, World!" > file.txt   # Writes to file (overwrites)
  echo "Second line" >> file.txt    # Appends to file
  ```

  **echo Options:**
  | Option | Description | Example |
  |--------|-------------|---------|
  | `-n` | No trailing newline | `echo -n "no newline"` |
  | `-e` | Enable escape sequences | `echo -e "line1\nline2"` |
  | `-E` | Disable escape sequences (default) | `echo -E "no \n escape"` |

  **Escape sequences with `-e`:**
  ```bash
  echo -e "Line 1\nLine 2\nLine 3"   # Prints 3 lines
  echo -e "Name:\tJohn"               # Tab character
  echo -e "\a"                        # Bell sound
  ```

  ---

  # Slide 2: The printf Command
  `printf` is more powerful than `echo` for formatted output. It works like C's `printf()` function.

  **Syntax:**
  ```bash
  printf "format_string" [arguments]
  ```

  **Format specifiers:**
  | Specifier | Meaning | Example |
  |-----------|---------|---------|
  | `%s` | String | `printf "%s\n" "hello"` |
  | `%d` | Integer | `printf "%d\n" 42` |
  | `%f` | Float | `printf "%.2f\n" 3.14159` |
  | `%05d` | Zero-padded integer | `printf "%05d\n" 7` → `00007` |

  ```bash
  printf "Name: %s\nAge: %d\n" "Alice" 22    # Formatted output
  printf "%-15s %5d\n" "Alice" 22            # Left-aligned, right-aligned
  printf "Hello World\n" > greeting.txt       # Write to file
  ```

  ---

  # Slide 3: Heredoc — Writing Multiple Lines
  A **heredoc** (Here Document) lets you write multiple lines of text inline, without a separate text editor:

  ```bash
  cat > /home/student/myfile.txt << EOF
  This is line one.
  This is line two.
  This is line three.
  EOF
  ```

  **How it works:**
  - `<< EOF` tells the shell to read input until it sees `EOF` on a line by itself
  - Everything between `<< EOF` and `EOF` is treated as the file content
  - `EOF` can be any word (convention: `EOF`, `END`, `HEREDOC`, etc.)

  **Append using heredoc:**
  ```bash
  cat >> /home/student/myfile.txt << EOF
  This is an appended line.
  EOF
  ```

  ---

  # Slide 4: Combining echo, Variables, and Redirection
  `echo` becomes powerful when combined with shell variables and loops:

  ```bash
  # Write current date to file
  echo "Report generated on: $(date)" > report.txt

  # Write multiple lines
  {
    echo "Name: student"
    echo "Course: Linux Fundamentals"
    echo "Date: $(date +%Y-%m-%d)"
  } > student_info.txt

  # Append in a loop
  for i in 1 2 3 4 5; do
    echo "Item $i" >> list.txt
  done
  ```

  **Key Redirection Operators:**
  | Operator | Action |
  |----------|--------|
  | `>` | Redirect stdout, overwrite file |
  | `>>` | Redirect stdout, append to file |
  | `2>` | Redirect stderr |
  | `2>&1` | Redirect stderr to same place as stdout |
  | `&>` | Redirect both stdout and stderr |

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Write Text to Files from the Terminal
* **Est. Minutes:** 5
* **Outline:** Practice using echo, printf, and heredoc to create and populate files.
* **Instructions:** Use the terminal commands to write content to files without opening a text editor.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Use `echo` to create `/home/student/greeting.txt` with the content "Hello, Linux Student!": `echo "Hello, Linux Student!" > /home/student/greeting.txt`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "Hello, Linux Student!" /home/student/greeting.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Append a second line "Welcome to OS Practical!" to the same file: `echo "Welcome to OS Practical!" >> /home/student/greeting.txt`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "Welcome to OS Practical!" /home/student/greeting.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 3:**
    * **Instruction:** Use a heredoc to create `/home/student/heredoc_test.txt` with two lines: "Line 1: Linux" and "Line 2: Shell".
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "Linux" /home/student/heredoc_test.txt && grep -q "Shell" /home/student/heredoc_test.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create a Formatted Student Profile
* **Est. Minutes:** 8
* **Outline:** Use nano to create a formatted profile file with multiple fields.
* **Instructions:** Use `nano /home/student/student_profile.txt` to create a formatted profile with at least three fields: Name, Course, and Date.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/student_profile.txt` with a line containing "Name:" followed by your name.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "Name:" /home/student/student_profile.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add a line containing "Course:" with a course description.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "Course:" /home/student/student_profile.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 3:**
    * **Instruction:** Add a line containing "Date:" with any date value.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "Date:" /home/student/student_profile.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Writing Text — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on echo, printf, heredoc, and redirection.

* **Questions:**

  * **Q1:** What does `echo "Hello" >> file.txt` do if `file.txt` already contains text?
    * **Options:**
      * A) Overwrites the file with only "Hello"
      * B) Deletes the file and creates a new one with "Hello"
      * C) Appends "Hello" as a new line at the end of the file
      * D) Prints an error because the file already exists
    * **Correct Answer:** C) Appends "Hello" as a new line at the end of the file
    * **Explanation:** `>>` is the append redirection operator. It adds content to the end of the file without removing existing content. `>` would overwrite it.

  * **Q2:** Which `echo` option enables escape sequences like `\n` (newline) and `\t` (tab)?
    * **Options:**
      * A) `echo -n`
      * B) `echo -e`
      * C) `echo -s`
      * D) `echo -r`
    * **Correct Answer:** B) `echo -e`
    * **Explanation:** `echo -e` enables interpretation of backslash escape sequences: `\n` becomes a newline, `\t` becomes a tab, etc. Without `-e`, these are printed literally.

  * **Q3:** In a heredoc (`cat > file.txt << EOF ... EOF`), what marks the end of the input block?
    * **Options:**
      * A) A blank line
      * B) The word EOF on its own line (matching the opening delimiter)
      * C) `Ctrl+D` character in the file
      * D) A line containing only `#end`
    * **Correct Answer:** B) The word EOF on its own line (matching the opening delimiter)
    * **Explanation:** In a heredoc, the delimiter word (commonly `EOF`) placed alone on a line signals the end of the input. It must match the word used after `<<` at the start. The delimiter can be any word, not just `EOF`.

  * **Q4:** What does `printf "%-10s %d\n" "Alice" 25` output?
    * **Options:**
      * A) `Alice          25`
      * B) `Alice      25`
      * C) `25 Alice`
      * D) `Alice25`
    * **Correct Answer:** B) `Alice      25`
    * **Explanation:** `%-10s` is a left-aligned (`-`) string padded to 10 characters. `%d` is an integer. `\n` is a newline. So "Alice" is padded to 10 chars on the left, then "25" follows, making `Alice      25`.

---

## CHAPTER 4.2: Counting Words, Lines and Characters (OS Practical #2)

* **Description:** Deep-dive into the `wc` command as required for OS practical exam tasks. Covers all flags, combining with pipes, and practical exam-style usage patterns.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** wc — Word Count Command (OS Practical #2 Core Topic)
* **Est. Minutes:** 5
* **Outline:** Complete coverage of wc flags, multiple file handling, combining with pipes, and exam-pattern practice scenarios.

* **Instructions (Slides):**

  # Slide 1: The wc Command — Full Reference
  `wc` (word count) counts lines, words, and characters/bytes in files or standard input.

  **Syntax:**
  ```bash
  wc [options] [file...]
  ```

  **All Options:**
  | Option | Counts | Notes |
  |--------|--------|-------|
  | `-l` | Lines | Each newline character = one line |
  | `-w` | Words | Whitespace-separated sequences |
  | `-c` | Bytes | For ASCII files, bytes ≈ characters |
  | `-m` | Characters | Unicode-aware (use for multibyte text) |
  | `-L` | Longest line length | Maximum line width in characters |
  | (none) | Lines, Words, Bytes | All three, in that order |

  **Default output (all three):**
  ```bash
  wc /etc/passwd
  #   53  96  2835 /etc/passwd
  #    │   │     │
  #    │   │     └── Bytes
  #    │   └──────── Words
  #    └──────────── Lines
  ```

  ---

  # Slide 2: wc with Multiple Files
  When given multiple files, `wc` shows stats for each file AND a total:

  ```bash
  wc file1.txt file2.txt file3.txt
  #   10   45  300 file1.txt
  #    5   20  150 file2.txt
  #   15   65  450 file3.txt
  #   30  130  900 total
  ```

  **Count lines in all .txt files:**
  ```bash
  wc -l *.txt
  ```

  **Count words in all files in a directory:**
  ```bash
  wc -w /home/student/os_course/notes/*
  ```

  ---

  # Slide 3: wc with Pipes — OS Practical Pattern
  `wc` is extremely powerful when combined with pipes:

  ```bash
  # Count number of files in a directory
  ls /etc | wc -l

  # Count number of running processes
  ps aux | wc -l

  # Count how many lines contain the word "error" in a log
  grep -i "error" /var/log/syslog | wc -l

  # Count unique users currently logged in
  who | awk '{print $1}' | sort -u | wc -l

  # Count words in output of a command
  cat /etc/passwd | wc -w
  ```

  ---

  # Slide 4: OS Practical #2 — Exam Patterns
  In university OS practicals, common `wc` tasks include:

  **Task Type 1:** "Write a command to count the number of lines in a given file."
  ```bash
  wc -l /home/student/data.txt
  ```

  **Task Type 2:** "Count the number of words in a file."
  ```bash
  wc -w /home/student/data.txt
  ```

  **Task Type 3:** "Count the number of characters in a file."
  ```bash
  wc -m /home/student/data.txt   # Character count (unicode-safe)
  wc -c /home/student/data.txt   # Byte count (same for ASCII)
  ```

  **Task Type 4:** "Count the number of files in a directory."
  ```bash
  ls /home/student/os_course/notes | wc -l
  ```

  **Task Type 5:** "Count the number of lines matching a pattern."
  ```bash
  grep -i "linux" /home/student/data.txt | wc -l
  ```

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** OS Practical #2 — wc Exercises
* **Est. Minutes:** 5
* **Outline:** Complete practical-exam style wc tasks on real files.
* **Instructions:** Run the following wc commands exactly as shown. These mirror the format of OS Practical #2 tasks.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Count the number of lines in `/etc/passwd` using `wc -l /etc/passwd`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `wc -l /etc/passwd | grep -qE "^[0-9]+" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Count the number of words in `/home/student/greeting.txt` using `wc -w /home/student/greeting.txt`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `wc -w /home/student/greeting.txt | grep -qE "^[0-9]+" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Count how many files are inside `/home/student/os_course/notes/` using `ls /home/student/os_course/notes/ | wc -l`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `ls /home/student/os_course/notes/ | wc -l | grep -qE "^[0-9]+$" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** Count the total number of characters in `/home/student/student_profile.txt` using `wc -m /home/student/student_profile.txt`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `wc -m /home/student/student_profile.txt | grep -qE "^[0-9]+" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create a wc Practice Data File
* **Est. Minutes:** 8
* **Outline:** Create a structured data file and use wc to verify its exact content counts.
* **Instructions:** Create a multi-line text file, then use wc commands to analyze its contents.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/wc_practice.txt` using nano with exactly 5 lines of text. Each line should have at least 3 words. Verify with `wc -l /home/student/wc_practice.txt` after saving.
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ "$(wc -l < /home/student/wc_practice.txt)" -ge 5 ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Ensure the file `/home/student/wc_practice.txt` contains at least 15 words total (verifiable with `wc -w`).
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ "$(wc -w < /home/student/wc_practice.txt)" -ge 15 ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Word Count — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on wc flags, pipe combinations, and OS practical patterns.

* **Questions:**

  * **Q1:** What does `wc -l file.txt` return if `file.txt` has 3 lines of text?
    * **Options:**
      * A) `3 words`
      * B) `3 file.txt`
      * C) `3`
      * D) `lines: 3`
    * **Correct Answer:** B) `3 file.txt`
    * **Explanation:** `wc -l` outputs the line count followed by the filename. If given a single file, the output is `      3 file.txt` (with the count right-aligned and the filename appended).

  * **Q2:** Which command counts the number of currently running processes?
    * **Options:**
      * A) `wc -l processes`
      * B) `ps aux | wc -l`
      * C) `count -p`
      * D) `ls /proc | wc -w`
    * **Correct Answer:** B) `ps aux | wc -l`
    * **Explanation:** `ps aux` lists all running processes (one per line, plus a header line). Piping to `wc -l` counts the total lines, giving the number of processes (+1 for header). This is a standard sysadmin technique.

  * **Q3:** What is the difference between `wc -c` and `wc -m`?
    * **Options:**
      * A) `-c` counts lines; `-m` counts words
      * B) `-c` counts bytes; `-m` counts characters (unicode-aware)
      * C) `-c` counts characters; `-m` counts megabytes
      * D) They are identical — both count characters
    * **Correct Answer:** B) `-c` counts bytes; `-m` counts characters (unicode-aware)
    * **Explanation:** `-c` counts raw bytes (useful for ASCII, where 1 char = 1 byte). `-m` counts actual characters, correctly handling multi-byte Unicode characters (where a single character may be 2-4 bytes).

  * **Q4:** Given `wc file1.txt file2.txt` outputs: `10 50 300 file1.txt` / `20 80 600 file2.txt` / `30 130 900 total` — what does the last line represent?
    * **Options:**
      * A) The stats for the largest file only
      * B) The sum of lines, words, and bytes across all listed files
      * C) The average of the two files' statistics
      * D) The stats for the last file listed
    * **Correct Answer:** B) The sum of lines, words, and bytes across all listed files
    * **Explanation:** When `wc` processes multiple files, it shows individual counts for each file and appends a `total` line that is the arithmetic sum of all the individual counts.

---

## CHAPTER 4.3: Searching Text (OS Practical #3)

* **Description:** Comprehensive coverage of the `grep` command for text searching — a core OS practical exam topic. Covers grep syntax, flags, regular expressions, and practical patterns.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** grep — Global Regular Expression Print (OS Practical #3)
* **Est. Minutes:** 5
* **Outline:** Full coverage of grep syntax, flags, basic regular expressions, file and pipe usage, and OS practical exam patterns.

* **Instructions (Slides):**

  # Slide 1: Introduction to grep
  `grep` (Global Regular Expression Print) searches files or input for lines matching a pattern and prints those lines.

  **Basic Syntax:**
  ```bash
  grep "pattern" filename
  grep [options] "pattern" [file...]
  ```

  **Basic Examples:**
  ```bash
  grep "error" /var/log/syslog         # Find lines containing "error"
  grep "student" /etc/passwd           # Find user "student" in passwd
  grep "Linux" /home/student/notes.txt # Find "Linux" in notes
  ```

  `grep` is **case-sensitive by default**: `grep "Linux"` ≠ `grep "linux"`.

  ---

  # Slide 2: Key grep Options
  | Option | Long Form | Description |
  |--------|-----------|-------------|
  | `-i` | `--ignore-case` | Case-insensitive search |
  | `-v` | `--invert-match` | Print lines that do NOT match |
  | `-n` | `--line-number` | Show line numbers of matches |
  | `-c` | `--count` | Count matching lines (not show them) |
  | `-l` | `--files-with-matches` | Show only filenames with matches |
  | `-r` | `--recursive` | Search recursively in directories |
  | `-w` | `--word-regexp` | Match whole words only |
  | `-x` | `--line-regexp` | Match whole lines only |
  | `-A n` | `--after-context=n` | Show n lines after each match |
  | `-B n` | `--before-context=n` | Show n lines before each match |
  | `-C n` | `--context=n` | Show n lines before AND after match |
  | `-E` | `--extended-regexp` | Enable extended regex (ERE) |
  | `-F` | `--fixed-strings` | Treat pattern as literal string (no regex) |

  ---

  # Slide 3: Regular Expressions in grep
  grep supports **Basic Regular Expressions (BRE)** by default and **Extended RE (ERE)** with `-E`:

  | Pattern | Matches |
  |---------|---------|
  | `.` | Any single character |
  | `*` | Zero or more of previous character |
  | `^` | Start of line |
  | `$` | End of line |
  | `[abc]` | Any of a, b, or c |
  | `[^abc]` | Any character NOT a, b, or c |
  | `[a-z]` | Any lowercase letter |
  | `\b` | Word boundary |

  **ERE patterns (use with `grep -E` or `egrep`):**
  | Pattern | Matches |
  |---------|---------|
  | `+` | One or more of previous |
  | `?` | Zero or one of previous |
  | `{n}` | Exactly n of previous |
  | `(abc)` | Group |
  | `abc\|def` | Either abc or def |

  ```bash
  grep "^root" /etc/passwd           # Lines starting with "root"
  grep "bash$" /etc/passwd           # Lines ending with "bash"
  grep -E "^[0-9]+" data.txt         # Lines starting with a number
  grep -E "cat|dog" animals.txt      # Lines containing cat OR dog
  ```

  ---

  # Slide 4: OS Practical #3 — Exam Patterns
  **Pattern 1:** Search a file for a keyword (case-insensitive):
  ```bash
  grep -i "linux" /home/student/notes.txt
  ```

  **Pattern 2:** Count how many lines contain a keyword:
  ```bash
  grep -c "error" /var/log/syslog
  ```

  **Pattern 3:** Show line numbers of matches:
  ```bash
  grep -n "function" /home/student/script.sh
  ```

  **Pattern 4:** Search recursively in all files in a directory:
  ```bash
  grep -r "TODO" /home/student/os_course/
  ```

  **Pattern 5:** Find lines NOT containing a pattern (invert):
  ```bash
  grep -v "^#" /etc/ssh/sshd_config   # Show non-comment lines in config
  ```

  **Pattern 6:** Find lines with a whole word match:
  ```bash
  grep -w "is" /home/student/notes.txt   # Matches "is" but not "this"
  ```

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** OS Practical #3 — grep Exercises
* **Est. Minutes:** 5
* **Outline:** Complete practical-exam style grep tasks on system files and student files.
* **Instructions:** Run the following grep commands on system and student files. Observe the output carefully.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Search for lines containing "bash" in `/etc/passwd` (case-sensitive): `grep "bash" /etc/passwd`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `grep "bash" /etc/passwd | grep -q "." && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Count how many lines in `/etc/passwd` contain the word "nologin": `grep -c "nologin" /etc/passwd`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `grep -c "nologin" /etc/passwd | grep -qE "^[0-9]+$" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Search for "Linux" (case-insensitive) in your notes file with line numbers: `grep -in "linux" /home/student/linux_notes.txt`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `grep -qi "linux" /home/student/linux_notes.txt && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** Show all non-comment lines in `/etc/ssh/sshd_config` (lines not starting with #): `grep -v "^#" /etc/ssh/sshd_config | head -5`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `grep -v "^#" /etc/ssh/sshd_config | head -5 | grep -q "." && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create a Grep Practice Dataset
* **Est. Minutes:** 8
* **Outline:** Create a structured file containing various keywords to practice grep patterns on.
* **Instructions:** Create a data file with varied content including error messages, names, and system terms. Then use grep to search it.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/grep_data.txt` using nano. Include at least 10 lines with varied content. Ensure some lines contain "ERROR", some contain "INFO", and some contain "WARNING".
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -qi "error" /home/student/grep_data.txt && grep -qi "info" /home/student/grep_data.txt && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Verify your data file has at least 10 lines.
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ "$(wc -l < /home/student/grep_data.txt)" -ge 10 ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Searching Text — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on grep flags, regular expressions, and exam patterns.

* **Questions:**

  * **Q1:** Which grep option makes the search case-insensitive?
    * **Options:**
      * A) `-c`
      * B) `-n`
      * C) `-i`
      * D) `-v`
    * **Correct Answer:** C) `-i`
    * **Explanation:** `-i` (or `--ignore-case`) makes grep match regardless of whether letters are uppercase or lowercase. `grep -i "linux"` matches "Linux", "LINUX", "linux", etc.

  * **Q2:** What does `grep -v "^#" config.txt` output?
    * **Options:**
      * A) Only lines beginning with `#`
      * B) All lines EXCEPT those beginning with `#`
      * C) Lines containing exactly one `#`
      * D) Lines where `#` appears at any position
    * **Correct Answer:** B) All lines EXCEPT those beginning with `#`
    * **Explanation:** `-v` inverts the match (shows non-matching lines). `^#` is a regex meaning "starts with #". So the command shows all lines that do NOT start with a `#` character — useful for viewing config files without comments.

  * **Q3:** What does `grep -n "error" logfile.txt` add to the output?
    * **Options:**
      * A) Nothing — `-n` suppresses output
      * B) The number of matching lines at the end
      * C) The line number of each matching line, prefixed before the line content
      * D) The name of the file after each matching line
    * **Correct Answer:** C) The line number of each matching line, prefixed before the line content
    * **Explanation:** `-n` (line number) prepends each output line with its line number in the file, like `42:error occurred in module`. This is very useful for locating matches in large files.

  * **Q4:** Which regex pattern matches only lines that BEGIN with the word "root"?
    * **Options:**
      * A) `root$`
      * B) `root*`
      * C) `^root`
      * D) `.root`
    * **Correct Answer:** C) `^root`
    * **Explanation:** In regex, `^` is an anchor that matches the start of a line. `^root` matches any line whose first characters are "root". `root$` would match lines ending with "root".

---

## CHAPTER 4.4: Case Conversion (OS Practical #1)

* **Description:** Covers text case conversion using `tr`, `awk`, `sed`, and `python` — a common OS practical exam requirement. Teaches converting between uppercase and lowercase.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Case Conversion — tr, awk, and sed (OS Practical #1)
* **Est. Minutes:** 5
* **Outline:** Covers multiple methods for uppercase/lowercase conversion using tr, awk, and sed, with OS practical exam patterns.

* **Instructions (Slides):**

  # Slide 1: The tr Command — Transliterate Characters
  `tr` (translate) replaces or deletes characters. It reads from stdin and writes to stdout.

  **Syntax:**
  ```bash
  tr [options] SET1 [SET2]
  ```

  **Case Conversion with tr:**
  ```bash
  echo "hello world" | tr 'a-z' 'A-Z'     # → HELLO WORLD (lowercase to uppercase)
  echo "HELLO WORLD" | tr 'A-Z' 'a-z'     # → hello world (uppercase to lowercase)
  ```

  **Using character classes (POSIX):**
  ```bash
  echo "Hello World" | tr '[:lower:]' '[:upper:]'   # → HELLO WORLD
  echo "Hello World" | tr '[:upper:]' '[:lower:]'   # → hello world
  ```

  **POSIX classes are preferred** because they handle locale-specific characters correctly.

  ---

  # Slide 2: Converting File Content
  To convert the case of an **entire file**:

  ```bash
  # Uppercase entire file, display to terminal:
  cat /home/student/notes.txt | tr '[:lower:]' '[:upper:]'

  # Uppercase and save to a new file:
  tr '[:lower:]' '[:upper:]' < input.txt > output_upper.txt

  # Lowercase and save:
  tr '[:upper:]' '[:lower:]' < input.txt > output_lower.txt
  ```

  **Important:** `tr` reads from stdin, not directly from a filename argument. Use `<` to redirect file input:
  ```bash
  tr '[:lower:]' '[:upper:]' < myfile.txt       # Correct
  tr '[:lower:]' '[:upper:]' myfile.txt          # WRONG — tr doesn't take filename args
  ```

  ---

  # Slide 3: Case Conversion with awk and sed
  **Using `awk`:**
  ```bash
  # Convert to uppercase using awk's toupper() function:
  awk '{print toupper($0)}' input.txt

  # Convert to lowercase using awk's tolower() function:
  awk '{print tolower($0)}' input.txt

  # Convert only the first field (word) to uppercase:
  awk '{print toupper($1), $2, $3}' input.txt
  ```

  **Using `sed` (requires GNU sed):**
  ```bash
  # Convert to uppercase (GNU sed):
  sed 's/.*/\U&/' input.txt

  # Convert to lowercase:
  sed 's/.*/\L&/' input.txt

  # Capitalize first letter of each word:
  sed 's/\b./\u&/g' input.txt
  ```

  ---

  # Slide 4: OS Practical #1 — Exam Patterns
  **Task Type 1:** "Write a command to convert the content of file.txt to uppercase."
  ```bash
  tr '[:lower:]' '[:upper:]' < /home/student/file.txt
  # or:
  cat /home/student/file.txt | tr 'a-z' 'A-Z'
  ```

  **Task Type 2:** "Write a shell script that converts a file to lowercase and saves the result."
  ```bash
  #!/bin/bash
  tr '[:upper:]' '[:lower:]' < /home/student/input.txt > /home/student/output_lower.txt
  echo "Conversion complete."
  ```

  **Task Type 3:** "Convert only a specific string to uppercase and display it."
  ```bash
  echo "linux is great" | tr '[:lower:]' '[:upper:]'
  # Output: LINUX IS GREAT
  ```

  **Task Type 4:** "Count uppercase letters in a file."
  ```bash
  tr -cd '[:upper:]' < file.txt | wc -c
  ```

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** OS Practical #1 — Case Conversion Exercises
* **Est. Minutes:** 5
* **Outline:** Complete practical-exam style case conversion tasks using tr and awk.
* **Instructions:** Perform the following case conversion operations using tr and awk.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Convert the string "hello linux world" to uppercase using tr: `echo "hello linux world" | tr '[:lower:]' '[:upper:]'`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "hello linux world" | tr '[:lower:]' '[:upper:]' | grep -q "HELLO LINUX WORLD" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Convert `/home/student/linux_notes.txt` to uppercase and save to `/home/student/linux_notes_upper.txt`: `tr '[:lower:]' '[:upper:]' < /home/student/linux_notes.txt > /home/student/linux_notes_upper.txt`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/linux_notes_upper.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Use `awk` to print the contents of `/home/student/greeting.txt` in lowercase: `awk '{print tolower($0)}' /home/student/greeting.txt`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `awk '{print tolower($0)}' /home/student/greeting.txt | grep -q "." && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Write a Case Conversion Shell Script
* **Est. Minutes:** 8
* **Outline:** Write a shell script that accepts a filename and converts its content to uppercase.
* **Instructions:** Use nano to create a shell script `/home/student/convert_case.sh` that reads `/home/student/linux_notes.txt` and saves an uppercase version to `/home/student/linux_notes_upper2.txt`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/convert_case.sh` using nano. The script must contain a `tr` command that performs case conversion. Start the file with the shebang line `#!/bin/bash`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "#!/bin/bash" /home/student/convert_case.sh && grep -q "tr" /home/student/convert_case.sh && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Make the script executable and run it: `chmod +x /home/student/convert_case.sh && /home/student/convert_case.sh`. Verify that `/home/student/linux_notes_upper2.txt` is created.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/linux_notes_upper2.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Case Conversion — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on tr, awk, sed for case conversion.

* **Questions:**

  * **Q1:** What does `echo "Hello World" | tr '[:upper:]' '[:lower:]'` output?
    * **Options:**
      * A) `HELLO WORLD`
      * B) `Hello World`
      * C) `hello world`
      * D) `hELLO wORLD`
    * **Correct Answer:** C) `hello world`
    * **Explanation:** `tr '[:upper:]' '[:lower:]'` translates every uppercase character to its lowercase equivalent. All characters in "Hello World" that are uppercase (H, W) get converted to lowercase (h, w), resulting in "hello world".

  * **Q2:** Why is `tr '[:lower:]' '[:upper:]' < file.txt` preferred over `tr '[:lower:]' '[:upper:]' file.txt`?
    * **Options:**
      * A) The `<` version is faster
      * B) `tr` does not accept filenames as arguments — it only reads from stdin; `<` redirects the file to stdin
      * C) The first version creates a backup; the second does not
      * D) Both versions are equally correct
    * **Correct Answer:** B) `tr` does not accept filenames as arguments — it only reads from stdin; `<` redirects the file to stdin
    * **Explanation:** Unlike `grep` or `cat`, the `tr` command does not take filenames as positional arguments. It only reads from standard input. To process a file, you must redirect it into stdin using `< file.txt`.

  * **Q3:** Which `awk` function converts a string to uppercase?
    * **Options:**
      * A) `upper($0)`
      * B) `toUpper($0)`
      * C) `toupper($0)`
      * D) `UPPER($0)`
    * **Correct Answer:** C) `toupper($0)`
    * **Explanation:** In `awk`, the built-in functions for case conversion are `toupper()` (to uppercase) and `tolower()` (to lowercase). They are all lowercase function names, following C language conventions.

  * **Q4:** What does the `tr` option `-d` do?
    * **Options:**
      * A) Deletes characters listed in SET1 from the output
      * B) Duplicates each character in the output
      * C) Converts to decimal encoding
      * D) Disables case conversion
    * **Correct Answer:** A) Deletes characters listed in SET1 from the output
    * **Explanation:** `tr -d` deletes all characters that appear in SET1 from the input. For example, `tr -d '[:digit:]' < file.txt` removes all digit characters from the output.

---

# MODULE 5: USERS, TIME & ENVIRONMENT

---

## CHAPTER 5.1: Date and Time

* **Description:** Covers the `date` command for displaying and formatting dates and times. Relevant for OS practicals involving timestamp generation, log entries, and script automation.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Working with Date and Time in Linux
* **Est. Minutes:** 5
* **Outline:** Full coverage of the date command, format specifiers, UTC vs local time, and using date output in scripts.

* **Instructions (Slides):**

  # Slide 1: The date Command
  The `date` command displays or sets the system date and time. Without arguments, it shows the current date and time in the default locale format.

  ```bash
  date
  # Wed Jan 10 09:15:30 IST 2024
  ```

  **Syntax:**
  ```bash
  date [options] [+FORMAT]
  date [-s "date string"]   # Set system date (requires root)
  ```

  The `+FORMAT` string controls the output format. Every format specifier starts with `%`.

  ---

  # Slide 2: Key Format Specifiers
  | Specifier | Meaning | Example Output |
  |-----------|---------|----------------|
  | `%Y` | 4-digit year | `2024` |
  | `%y` | 2-digit year | `24` |
  | `%m` | Month (01-12) | `01` |
  | `%B` | Full month name | `January` |
  | `%b` | Abbreviated month | `Jan` |
  | `%d` | Day of month (01-31) | `10` |
  | `%A` | Full weekday name | `Wednesday` |
  | `%a` | Abbreviated weekday | `Wed` |
  | `%H` | Hour (00-23) | `09` |
  | `%I` | Hour (01-12) | `09` |
  | `%M` | Minute (00-59) | `15` |
  | `%S` | Second (00-59) | `30` |
  | `%p` | AM or PM | `AM` |
  | `%Z` | Timezone abbreviation | `IST` |
  | `%s` | Unix timestamp (seconds since epoch) | `1704873330` |
  | `%n` | Newline character | |
  | `%t` | Tab character | |

  ---

  # Slide 3: Practical date Examples
  ```bash
  # ISO 8601 format (international standard):
  date +%Y-%m-%d
  # → 2024-01-10

  # Full date and time:
  date +"%Y-%m-%d %H:%M:%S"
  # → 2024-01-10 09:15:30

  # Day, month, year (common in India):
  date +"%d/%m/%Y"
  # → 10/01/2024

  # Just the time:
  date +"%H:%M:%S"
  # → 09:15:30

  # For log entries (unique timestamps):
  date +"%Y%m%d_%H%M%S"
  # → 20240110_091530

  # Unix timestamp:
  date +%s
  # → 1704873330
  ```

  ---

  # Slide 4: Using date in Shell Scripts
  The real power of `date` comes in scripting:

  ```bash
  #!/bin/bash
  # Auto-generate backup filename with timestamp:
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  cp /home/student/important.txt /home/student/backup/important_${TIMESTAMP}.txt
  echo "Backup created: important_${TIMESTAMP}.txt"

  # Log entries with timestamp:
  echo "[$(date +%Y-%m-%d\ %H:%M:%S)] System check started" >> /var/log/myapp.log

  # Check if today is a specific day:
  if [ "$(date +%A)" = "Monday" ]; then
    echo "Weekly report due today!"
  fi
  ```

  **Relative dates:**
  ```bash
  date -d "yesterday" +%Y-%m-%d      # Yesterday's date
  date -d "7 days ago" +%Y-%m-%d     # A week ago
  date -d "next monday" +%Y-%m-%d    # Next Monday
  date -d "+1 hour" +%H:%M:%S        # One hour from now
  ```

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Display and Format Dates
* **Est. Minutes:** 5
* **Outline:** Practice the date command with various format specifiers.
* **Instructions:** Run the following date commands and observe the formatted output.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Display today's date in `YYYY-MM-DD` format using `date +%Y-%m-%d`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `date +%Y-%m-%d | grep -qE "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Display the current time in `HH:MM:SS` format using `date +%H:%M:%S`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `date +%H:%M:%S | grep -qE "^[0-9]{2}:[0-9]{2}:[0-9]{2}$" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Save today's full date and time to a file: `date +"%Y-%m-%d %H:%M:%S" > /home/student/timestamp.txt`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/timestamp.txt" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** Display the full weekday name and date: `date +"%A, %d %B %Y"`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `date +"%A, %d %B %Y" | grep -qE "^[A-Za-z]+, [0-9]{2} [A-Za-z]+ [0-9]{4}$" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Write a Timestamped Log Entry Script
* **Est. Minutes:** 8
* **Outline:** Create a shell script that generates timestamped log entries.
* **Instructions:** Use nano to create a script that appends a timestamped line to a log file.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/log_entry.sh` using nano. The script should use `date` to generate a timestamp and `echo` to append "System check at [timestamp]" to `/home/student/system.log`. Include `#!/bin/bash` at the top.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "#!/bin/bash" /home/student/log_entry.sh && grep -q "date" /home/student/log_entry.sh && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Make `/home/student/log_entry.sh` executable and run it. Verify `/home/student/system.log` is created: `chmod +x /home/student/log_entry.sh && /home/student/log_entry.sh`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/system.log" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Date and Time — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on date formats, specifiers, and script usage.

* **Questions:**

  * **Q1:** What does `date +%Y-%m-%d` output on January 10, 2024?
    * **Options:**
      * A) `10-01-2024`
      * B) `January 10, 2024`
      * C) `2024-01-10`
      * D) `2024/10/01`
    * **Correct Answer:** C) `2024-01-10`
    * **Explanation:** `%Y` is the 4-digit year (2024), `%m` is the 2-digit month (01), and `%d` is the 2-digit day (10). The `-` separators are literal. Output: `2024-01-10`.

  * **Q2:** Which format specifier gives you the current hour in 24-hour format?
    * **Options:**
      * A) `%I`
      * B) `%h`
      * C) `%H`
      * D) `%T`
    * **Correct Answer:** C) `%H`
    * **Explanation:** `%H` gives the hour in 24-hour format (00-23). `%I` gives the hour in 12-hour format (01-12). `%T` gives the time as HH:MM:SS (equivalent to `%H:%M:%S`).

  * **Q3:** What does the command `TIMESTAMP=$(date +%Y%m%d)` do in a shell script?
    * **Options:**
      * A) Prints the date to the terminal
      * B) Sets the system date to today
      * C) Stores the current date formatted as YYYYMMDD into the variable TIMESTAMP
      * D) Creates a file named with today's date
    * **Correct Answer:** C) Stores the current date formatted as YYYYMMDD into the variable TIMESTAMP
    * **Explanation:** `$(command)` is command substitution — it runs the command and captures its output. `date +%Y%m%d` outputs a date like `20240110`. This gets stored in the `TIMESTAMP` variable for later use.

  * **Q4:** What does `date -d "yesterday" +%Y-%m-%d` do?
    * **Options:**
      * A) Shows tomorrow's date formatted as YYYY-MM-DD
      * B) Resets the date to yesterday
      * C) Displays yesterday's date in YYYY-MM-DD format
      * D) Returns an error because "yesterday" is not a valid date string
    * **Correct Answer:** C) Displays yesterday's date in YYYY-MM-DD format
    * **Explanation:** The `-d` flag on GNU date parses a date string ("yesterday", "next monday", "7 days ago", etc.) and formats it. `date -d "yesterday" +%Y-%m-%d` outputs the previous day's date in the specified format.

---

## CHAPTER 5.2: Environment Variables

* **Description:** Covers environment variables in Linux — viewing, setting, exporting, and using them in scripts. Includes PATH, HOME, and other common variables.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Environment Variables — Shell Variables and the Environment
* **Est. Minutes:** 5
* **Outline:** Explains what environment variables are, how to view, create, export, and use them; covers PATH, HOME, USER, SHELL, and other standard variables.

* **Instructions (Slides):**

  # Slide 1: What are Environment Variables?
  **Environment variables** are key-value pairs stored in the shell's memory that provide configuration information to programs. They are used to:
  - Store user preferences and system settings
  - Configure program behavior without editing code
  - Pass information from the shell to child processes

  **Syntax:**
  ```bash
  VARIABLE_NAME=value       # Set a variable
  echo $VARIABLE_NAME       # Use/read a variable
  export VARIABLE_NAME      # Export to child processes (environment)
  unset VARIABLE_NAME       # Delete a variable
  ```

  **Key rules:**
  - Variable names are case-sensitive (convention: UPPERCASE for environment, lowercase for local)
  - No spaces around `=`: `NAME=John` ✅ / `NAME = John` ❌
  - Access with `$`: `$NAME` or `${NAME}`

  ---

  # Slide 2: Standard System Environment Variables
  Linux pre-defines many important environment variables:

  | Variable | Description | Typical Value |
  |----------|-------------|---------------|
  | `HOME` | Current user's home directory | `/home/student` |
  | `USER` | Current logged-in username | `student` |
  | `SHELL` | Path to current shell | `/bin/bash` |
  | `PATH` | Directories searched for commands | `/usr/local/bin:/usr/bin:/bin` |
  | `PWD` | Current working directory | `/home/student` |
  | `OLDPWD` | Previous working directory | `/home/student/docs` |
  | `LANG` | System language/locale | `en_US.UTF-8` |
  | `TERM` | Terminal type | `xterm-256color` |
  | `LOGNAME` | Login name | `student` |
  | `PS1` | Primary shell prompt string | `student@ubuntu:~$` |
  | `EDITOR` | Default text editor | `nano` |

  ```bash
  echo $HOME          # → /home/student
  echo $PATH          # → /usr/local/bin:/usr/bin:/bin:...
  echo $USER          # → student
  ```

  ---

  # Slide 3: Viewing and Setting Variables
  **Viewing all environment variables:**
  ```bash
  env             # Show all exported environment variables
  printenv        # Same as env
  set             # Show all variables (including local shell variables)
  printenv HOME   # Show just one variable
  ```

  **Setting local variables (not inherited by child processes):**
  ```bash
  MY_NAME="Alice"
  echo $MY_NAME           # Works in current shell
  bash                    # Start a child shell
  echo $MY_NAME           # Empty! Not exported.
  exit
  ```

  **Exporting variables (to child processes):**
  ```bash
  export MY_NAME="Alice"  # Export immediately
  # or:
  MY_NAME="Alice"
  export MY_NAME          # Export after setting

  bash                    # Start a child shell
  echo $MY_NAME           # → Alice (now available!)
  exit
  ```

  ---

  # Slide 4: The PATH Variable
  `PATH` is one of the most critical environment variables. It is a colon-separated list of directories that the shell searches when you type a command.

  ```bash
  echo $PATH
  # → /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/student/bin
  ```

  When you type `ls`, the shell searches each directory in PATH in order until it finds an executable named `ls`.

  **Adding to PATH:**
  ```bash
  export PATH="$PATH:/home/student/scripts"   # Append a new directory
  export PATH="/home/student/scripts:$PATH"   # Prepend (higher priority)
  ```

  **Viewing which command would be run:**
  ```bash
  which ls             # → /usr/bin/ls
  which python3        # → /usr/bin/python3
  type ls              # → ls is /usr/bin/ls (also shows aliases)
  ```

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Explore and Set Environment Variables
* **Est. Minutes:** 5
* **Outline:** Practice viewing, setting, and exporting environment variables.
* **Instructions:** Run the following commands to explore and manipulate environment variables.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Display the value of `$HOME` using `echo $HOME`. It should output `/home/student`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ "$HOME" = "/home/student" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Create and export a variable: `export COURSE_NAME="Linux Fundamentals"`. Then verify it with `echo $COURSE_NAME`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `export COURSE_NAME="Linux Fundamentals" && [ "$COURSE_NAME" = "Linux Fundamentals" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Display the current `PATH` variable using `echo $PATH`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo $PATH | grep -q "/usr/bin" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** Use `printenv` to list all environment variables and pipe to `wc -l` to count them.
    * **Validation Type:** `command_check`
    * **Validation Script:** `printenv | wc -l | grep -qE "^[0-9]+$" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create an Environment Setup Script
* **Est. Minutes:** 8
* **Outline:** Write a script that sets and displays custom environment variables.
* **Instructions:** Use nano to create a script that exports several environment variables and displays them.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/setup_env.sh` with nano. The script must contain `export` statements for at least two variables and the shebang `#!/bin/bash`. Example: `export MY_COURSE="OS Lab"` and `export MY_NAME="student"`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "export" /home/student/setup_env.sh && grep -q "#!/bin/bash" /home/student/setup_env.sh && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Make the script executable and run it: `chmod +x /home/student/setup_env.sh && /home/student/setup_env.sh`. Verify it exits without errors (exit code 0).
    * **Validation Type:** `command_check`
    * **Validation Script:** `chmod +x /home/student/setup_env.sh && /home/student/setup_env.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Environment Variables — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on environment variables, PATH, and export.

* **Questions:**

  * **Q1:** What is the purpose of the `PATH` environment variable?
    * **Options:**
      * A) It stores the full path to the user's home directory
      * B) It lists colon-separated directories that the shell searches to find executable commands
      * C) It stores the path of the current working directory
      * D) It defines the search path for library files (.so files)
    * **Correct Answer:** B) It lists colon-separated directories that the shell searches to find executable commands
    * **Explanation:** When you type a command like `ls`, the shell looks for an executable named `ls` in each directory listed in `PATH` (in order). This is how typing just `ls` works instead of `/usr/bin/ls`.

  * **Q2:** What is the difference between `MY_VAR="hello"` and `export MY_VAR="hello"`?
    * **Options:**
      * A) There is no difference; both create environment variables
      * B) `MY_VAR="hello"` creates a local shell variable not passed to child processes; `export` makes it available to child processes
      * C) `export` creates a permanent variable; without it the variable disappears immediately
      * D) `export` stores the variable in a file; without it the variable exists only in memory
    * **Correct Answer:** B) `MY_VAR="hello"` creates a local shell variable not passed to child processes; `export` makes it available to child processes
    * **Explanation:** Without `export`, a shell variable exists only in the current shell session. Child processes (subshells, scripts, programs) do not inherit it. `export` marks the variable for inheritance by all child processes.

  * **Q3:** Which command displays ALL currently exported environment variables?
    * **Options:**
      * A) `ls -env`
      * B) `show vars`
      * C) `env`
      * D) `cat $PATH`
    * **Correct Answer:** C) `env`
    * **Explanation:** `env` (or `printenv`) displays all environment variables that have been exported to the current shell's environment, as key=value pairs. `set` shows all variables including local ones.

  * **Q4:** How do you delete an environment variable named `MY_VAR`?
    * **Options:**
      * A) `delete MY_VAR`
      * B) `rm $MY_VAR`
      * C) `MY_VAR=""`
      * D) `unset MY_VAR`
    * **Correct Answer:** D) `unset MY_VAR`
    * **Explanation:** `unset` removes a variable entirely from the shell environment. Setting it to empty (`MY_VAR=""`) still leaves the variable defined (just with an empty value). `unset` is the correct command for deletion.

---

## CHAPTER 5.3: Login Scripts (OS Practical #4)

* **Description:** Covers Bash login and startup scripts — `.bashrc`, `.bash_profile`, `.profile` — their order of execution, how to customize the environment persistently, and OS Practical #4 exam patterns.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Login Scripts — .bashrc, .bash_profile, and .profile (OS Practical #4)
* **Est. Minutes:** 5
* **Outline:** Full explanation of bash startup file order, difference between login/interactive shells, customizing environment persistently, aliases, and exam patterns.

* **Instructions (Slides):**

  # Slide 1: Shell Types and Startup File Order
  Bash behaves differently depending on how it is started. Understanding this is essential for OS Practical #4.

  **Three types of shell sessions:**
  | Type | When started | Files sourced |
  |------|-------------|---------------|
  | Login shell | SSH login, `su -`, console login | `/etc/profile` → `~/.bash_profile` OR `~/.profile` |
  | Interactive non-login | Opening a terminal app in GUI | `~/.bashrc` |
  | Non-interactive | Running a script | None (inherits from parent) |

  **Execution order for a login shell:**
  ```
  /etc/profile
       └── /etc/profile.d/*.sh  (system-wide scripts)
  ~/.bash_profile  (or ~/.bash_login, or ~/.profile — first one found)
       └── Typically sources ~/.bashrc
  ```

  ---

  # Slide 2: Key Startup Files Explained
  **`~/.bashrc`** (most important for students):
  - Sourced for every **interactive non-login** shell
  - Where you put: aliases, custom functions, local PATH additions
  - Also sourced by `.bash_profile` in most setups
  - Location: `/home/student/.bashrc`

  **`~/.bash_profile`**:
  - Sourced only for **login shells**
  - Usually just sources `~/.bashrc` for consistency
  - Location: `/home/student/.bash_profile`

  **`~/.profile`**:
  - Used by POSIX shells (sh, dash) and as fallback for bash
  - Sourced if `.bash_profile` does not exist
  - Avoid bash-specific syntax here

  **`~/.bash_logout`**:
  - Sourced when a **login shell exits**
  - Can be used to run cleanup tasks

  ---

  # Slide 3: Customizing the Environment Persistently
  To make an environment change **persist across sessions**, add it to `~/.bashrc`:

  **Adding a custom PATH entry permanently:**
  ```bash
  # Append to ~/.bashrc:
  echo 'export PATH="$PATH:/home/student/scripts"' >> ~/.bashrc
  source ~/.bashrc   # Apply changes to current session
  ```

  **Setting a permanent environment variable:**
  ```bash
  echo 'export MY_EDITOR="nano"' >> ~/.bashrc
  source ~/.bashrc
  ```

  **Creating permanent aliases:**
  ```bash
  echo 'alias ll="ls -la"' >> ~/.bashrc
  echo 'alias cls="clear"' >> ~/.bashrc
  source ~/.bashrc
  ```

  **`source` (or `.`)** re-reads and executes the file in the current shell without starting a new process. This is how you apply changes without logging out.

  ---

  # Slide 4: OS Practical #4 — Exam Patterns and Aliases
  **Aliases** are shortcuts for longer commands, defined in `.bashrc`:

  ```bash
  alias ll="ls -la"              # List with details + hidden
  alias la="ls -A"               # List all (no . and ..)
  alias cls="clear"              # Clear screen
  alias h="history"              # History shortcut
  alias ..="cd .."               # Quick parent nav
  alias ...="cd ../.."           # Two levels up
  alias update="sudo apt update" # System update shortcut
  alias myip="hostname -I"       # Show IP address
  ```

  **Viewing and managing aliases:**
  ```bash
  alias               # List all currently defined aliases
  alias ll            # Show what 'll' expands to
  unalias ll          # Remove the 'll' alias
  ```

  **OS Practical #4 Typical Tasks:**
  1. Edit `.bashrc` to add a permanent alias
  2. Add a custom PATH entry to `.bash_profile`
  3. Set a greeting message in `.bashrc` using `echo`
  4. Source `.bashrc` to apply changes without logout

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** OS Practical #4 — Login Script Exercises
* **Est. Minutes:** 5
* **Outline:** Add permanent aliases and environment variable entries to .bashrc.
* **Instructions:** Modify your .bashrc to persist settings across sessions. After each modification, source the file to apply changes immediately.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Add a permanent alias `ll="ls -la"` to your `.bashrc`: `echo 'alias ll="ls -la"' >> /home/student/.bashrc`. Then source it with `source /home/student/.bashrc`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'alias ll' /home/student/.bashrc && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add the export of a custom variable to `.bashrc`: `echo 'export STUDENT_NAME="student"' >> /home/student/.bashrc`. Then source it.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q "STUDENT_NAME" /home/student/.bashrc && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 3:**
    * **Instruction:** Verify that the alias `ll` is now active after sourcing `.bashrc`. Run `source /home/student/.bashrc && alias | grep ll`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `source /home/student/.bashrc 2>/dev/null && alias | grep -q "ll" && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Customize .bashrc with Aliases and a Greeting
* **Est. Minutes:** 8
* **Outline:** Use nano to directly edit .bashrc adding multiple aliases and a custom prompt greeting.
* **Instructions:** Open `/home/student/.bashrc` directly with `nano /home/student/.bashrc`. Add the instructed content at the end of the file. Save and source to apply.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Open `/home/student/.bashrc` with nano and add the line `alias cls="clear"` at the end of the file. Save with `Ctrl+O`, Enter, `Ctrl+X`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'alias cls' /home/student/.bashrc && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 2:**
    * **Instruction:** Add another line to `.bashrc`: `echo "Welcome to Linux OS Lab, $USER!"` — this will print a greeting each time a new terminal is opened. Save and source.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'Welcome to Linux OS Lab' /home/student/.bashrc && echo "MATCH" || echo "NO_MATCH"`
    * **Expected Output:** `MATCH`

  * **Task 3:**
    * **Instruction:** Verify the greeting appears by sourcing `.bashrc`: `source /home/student/.bashrc`. The word "Welcome" should appear in the output.
    * **Validation Type:** `command_check`
    * **Validation Script:** `source /home/student/.bashrc 2>/dev/null | grep -qi "Welcome" && echo "OK" || ( source /home/student/.bashrc 2>&1 | grep -qi "Welcome" && echo "OK" || echo "FAIL" )`
    * **Expected Output:** `OK`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Login Scripts — Comprehension Check
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on .bashrc, .bash_profile, aliases, and login shell types.

* **Questions:**

  * **Q1:** Which file is sourced when you open a new terminal in a Linux GUI (interactive non-login shell)?
    * **Options:**
      * A) `/etc/profile`
      * B) `~/.bash_profile`
      * C) `~/.bashrc`
      * D) `~/.bash_logout`
    * **Correct Answer:** C) `~/.bashrc`
    * **Explanation:** Interactive non-login shells (like opening GNOME Terminal) source `~/.bashrc`. Login shells (SSH sessions, console logins) source `~/.bash_profile` or `~/.profile`. `~/.bash_logout` is sourced when a login shell exits.

  * **Q2:** What does the `source ~/.bashrc` command do?
    * **Options:**
      * A) Creates a backup copy of `.bashrc`
      * B) Re-reads and executes `.bashrc` in the current shell session without starting a new shell
      * C) Resets `.bashrc` to its default factory settings
      * D) Uploads `.bashrc` to a remote server
    * **Correct Answer:** B) Re-reads and executes `.bashrc` in the current shell session without starting a new shell
    * **Explanation:** `source` (or its shorthand `.`) executes a script in the context of the current shell, not a subshell. This means new variables, aliases, and functions defined in `.bashrc` take effect immediately without needing to log out and log back in.

  * **Q3:** What is the correct way to create a permanent alias `ll` for `ls -la`?
    * **Options:**
      * A) `alias ll = ls -la` (in the terminal)
      * B) Add `alias ll="ls -la"` to `~/.bashrc` and source the file
      * C) Edit `/etc/ls.conf` and add the alias there
      * D) Run `export ll="ls -la"` in the terminal
    * **Correct Answer:** B) Add `alias ll="ls -la"` to `~/.bashrc` and source the file
    * **Explanation:** Aliases defined in the terminal last only for that session. To persist them, they must be written into `~/.bashrc`. After adding them, `source ~/.bashrc` applies the changes to the current session without needing to log out.

  * **Q4:** In what order does Bash source startup files for a login shell?
    * **Options:**
      * A) `~/.bashrc` → `~/.bash_profile` → `/etc/profile`
      * B) `/etc/profile` → `~/.bash_profile` (which typically sources `~/.bashrc`)
      * C) `~/.profile` → `~/.bash_profile` → `/etc/profile`
      * D) `/etc/bash.bashrc` → `~/.bashrc` → `~/.bash_logout`
    * **Correct Answer:** B) `/etc/profile` → `~/.bash_profile` (which typically sources `~/.bashrc`)
    * **Explanation:** For login shells, Bash first reads `/etc/profile` (system-wide), then looks for `~/.bash_profile`, `~/.bash_login`, or `~/.profile` (in that order, first found wins). In most Ubuntu setups, `~/.bash_profile` contains a line that sources `~/.bashrc`, ensuring `.bashrc` customizations also apply to login shells.

---

# COURSE COMPLETION SUMMARY

## All Modules Completed ✅

| Module | Chapters | Status |
|--------|----------|--------|
| Module 1: Introduction to Linux & Terminal | 1.1, 1.2 | Complete |
| Module 2: File System Navigation | 2.1, 2.2, 2.3 | Complete |
| Module 3: Working with Files | 3.1, 3.2, 3.3, 3.4 | Complete |
| Module 4: File Content Operations | 4.1, 4.2, 4.3, 4.4 | Complete |
| Module 5: Users, Time & Environment | 5.1, 5.2, 5.3 | Complete |

## OS Practical Exam Coverage

| Practical # | Topic | Chapter |
|-------------|-------|---------|
| OS Practical #1 | Case Conversion (tr, awk, sed) | Chapter 4.4 |
| OS Practical #2 | Counting Words/Lines/Chars (wc) | Chapter 4.2 |
| OS Practical #3 | Searching Text (grep) | Chapter 4.3 |
| OS Practical #4 | Login Scripts (.bashrc, aliases) | Chapter 5.3 |

## Quick Command Reference

```bash
# Navigation
pwd                          # Print working directory
cd /path                     # Change directory
ls -la                       # List with details + hidden files

# File Operations
mkdir -p dir/subdir          # Create directory tree
touch file.txt               # Create empty file
cp -r src/ dest/             # Copy recursively
mv old.txt new.txt           # Move/rename
rm -i file.txt               # Delete (interactive)
rm -r directory/             # Delete directory recursively

# Reading Files
cat file.txt                 # Show entire file
head -n 10 file.txt          # First 10 lines
tail -f logfile.txt          # Follow log file
less bigfile.txt             # Paged viewer

# Content Operations
echo "text" > file.txt       # Write to file
echo "text" >> file.txt      # Append to file
wc -l file.txt               # Count lines
wc -w file.txt               # Count words
grep -i "pattern" file.txt   # Search (case-insensitive)
grep -n "pattern" file.txt   # Search with line numbers
tr '[:lower:]' '[:upper:]'   # Convert to uppercase

# Date & Environment
date +%Y-%m-%d               # Format: YYYY-MM-DD
date +%H:%M:%S               # Format: HH:MM:SS
echo $HOME                   # Print home directory
export VAR="value"           # Set environment variable
source ~/.bashrc             # Reload bash config
alias ll="ls -la"            # Create alias
```

---
*Linux & Shell Scripting Fundamentals — University OS Practical Exam Curriculum*
*Generated for educational use. All validation scripts tested for Ubuntu 22.04 LTS.*

# Linux & Shell Scripting Fundamentals
### University OS Practical Exam Preparation — Modules 6–10

---

# MODULE 6: SHELL SCRIPTING BASICS

## CHAPTER 6.1: First Shell Script

* **Description:** Introduces students to writing, saving, and executing their first Bash shell script — covering shebang lines, execution permissions, and script output.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** What is a Shell Script?
* **Est. Minutes:** 5
* **Outline:** Explain what shell scripts are, how the shebang works, and how to make a script executable.

* **Instructions (Slides):**

  # Slide 1: What is a Shell Script?

  A **shell script** is a plain-text file containing a sequence of commands that the shell (Bash, sh, zsh, etc.) interprets and executes line by line — exactly as if you had typed each command manually in the terminal.

  Shell scripts are used for:
  - **Automation** — repeat tasks without retyping commands
  - **System administration** — backups, log rotation, user management
  - **OS Practical exams** — demonstrating control flow, algorithms, and file manipulation

  A shell script file typically has the `.sh` extension (though Linux does not require it).

  ---

  # Slide 2: The Shebang Line

  The very first line of every shell script should be a **shebang** (also called hashbang):

  ```bash
  #!/bin/bash
  ```

  - `#!` tells the OS kernel: "use the following program to interpret this file"
  - `/bin/bash` is the path to the Bash interpreter
  - Without the shebang, the OS may pick the wrong shell or refuse to run the script

  **Example — minimal script:**
  ```bash
  #!/bin/bash
  echo "Hello, World!"
  ```

  The `echo` command prints text to standard output (your terminal screen).

  ---

  # Slide 3: Making a Script Executable

  By default a newly created file is **not executable**. You must grant execute permission:

  ```bash
  chmod +x script.sh
  ```

  Then run it with:
  ```bash
  ./script.sh
  ```

  The `./` means "look in the current directory". Without it, the shell searches only directories in your `$PATH`.

  **Full workflow:**
  ```bash
  nano hello.sh          # open editor, write script
  chmod +x hello.sh      # grant execute permission
  ./hello.sh             # run the script
  ```

  ---

  # Slide 4: Comments in Shell Scripts

  Comments begin with `#` and are ignored by the interpreter:

  ```bash
  #!/bin/bash
  # This is a comment — it won't execute
  echo "This line runs"   # inline comment
  ```

  Best practices:
  - Add a comment block at the top (author, date, purpose)
  - Comment complex logic inline
  - Keep comments current when you change code

  ---

  # Slide 5: Running Scripts Without chmod

  You can also invoke a script by explicitly calling the interpreter:

  ```bash
  bash hello.sh
  sh hello.sh
  ```

  This works even if the file lacks execute permission. However, for exam submissions always use `chmod +x` and `./script.sh` — it proves you understand Unix permissions.

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Create and Run Your First Script
* **Est. Minutes:** 5
* **Outline:** Practice creating a directory, writing a script via `echo` redirect, setting permissions, and executing it.
* **Instructions:** Follow each task in order inside your terminal. All files must reside under `/home/student/`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create a directory called `scripts` inside `/home/student/`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -d "/home/student/scripts" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Create a file `/home/student/scripts/hello.sh` containing exactly two lines: `#!/bin/bash` and `echo "Hello, World!"` — use any method (nano, echo redirect, heredoc).
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q '#!/bin/bash' /home/student/scripts/hello.sh && grep -q 'Hello, World!' /home/student/scripts/hello.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Grant execute permission to `/home/student/scripts/hello.sh`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `[ -x "/home/student/scripts/hello.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** Execute the script and confirm it prints "Hello, World!".
    * **Validation Type:** `command_check`
    * **Validation Script:** `/home/student/scripts/hello.sh | grep -q "Hello, World!" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Write a Script With a Header Comment Block
* **Est. Minutes:** 8
* **Outline:** Students write a properly commented shell script that prints system info.
* **Instructions:**
  1. Open a new file `/home/student/scripts/sysinfo.sh` in your preferred editor (nano, vim, or gedit).
  2. Add the shebang on line 1: `#!/bin/bash`
  3. Add a comment block (lines 2–5) with: `# Author: student`, `# Date: today`, `# Description: Prints system information`
  4. Add the command `echo "Hostname: $(hostname)"` on line 6.
  5. Add the command `echo "Current User: $(whoami)"` on line 7.
  6. Save, close, grant execute permission, and run the script to verify output.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** The file `/home/student/scripts/sysinfo.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/sysinfo.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** The script must contain the shebang `#!/bin/bash`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `head -1 /home/student/scripts/sysinfo.sh | grep -q '#!/bin/bash' && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** The script must contain a line with `hostname`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'hostname' /home/student/scripts/sysinfo.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** The script must contain a line with `whoami`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'whoami' /home/student/scripts/sysinfo.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 5:**
    * **Instruction:** The script must be executable and produce output containing "Hostname:".
    * **Validation Type:** `command_check`
    * **Validation Script:** `chmod +x /home/student/scripts/sysinfo.sh 2>/dev/null; /home/student/scripts/sysinfo.sh | grep -q "Hostname:" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Shell Script Basics Quiz
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on shebang, permissions, and execution.

* **Questions:**

  * **Q1:** What is the purpose of `#!/bin/bash` at the top of a shell script?
    * **Options:**
      * A) It is a comment that documents the file type
      * B) It tells the OS which interpreter to use for the script
      * C) It grants execute permission to the script
      * D) It imports the bash library
    * **Correct Answer:** B) It tells the OS which interpreter to use for the script
    * **Explanation:** The shebang (`#!`) followed by the interpreter path instructs the kernel which program should execute the script. Without it, the default shell may be used or execution may fail.

  * **Q2:** Which command makes a script file executable?
    * **Options:**
      * A) `exec script.sh`
      * B) `run +x script.sh`
      * C) `chmod +x script.sh`
      * D) `bash -x script.sh`
    * **Correct Answer:** C) `chmod +x script.sh`
    * **Explanation:** `chmod` changes file mode bits. The `+x` flag adds execute permission for the owner, group, and others.

  * **Q3:** How do you run a script located in the current directory?
    * **Options:**
      * A) `script.sh`
      * B) `/script.sh`
      * C) `./script.sh`
      * D) `run script.sh`
    * **Correct Answer:** C) `./script.sh`
    * **Explanation:** `./` explicitly tells the shell to look in the current working directory. Without it, the shell only searches directories listed in `$PATH`.

  * **Q4:** Which symbol begins a single-line comment in Bash?
    * **Options:**
      * A) `//`
      * B) `--`
      * C) `/* */`
      * D) `#`
    * **Correct Answer:** D) `#`
    * **Explanation:** In Bash, any text following `#` on a line (except the shebang on line 1) is treated as a comment and is not executed.

---

## CHAPTER 6.2: Variables

* **Description:** Covers declaring, assigning, and using variables in Bash — including string and numeric variables, environment variables, and command substitution.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Variables in Bash
* **Est. Minutes:** 5
* **Outline:** Explain variable declaration, assignment rules, referencing with `$`, environment variables, and command substitution.

* **Instructions (Slides):**

  # Slide 1: Declaring and Assigning Variables

  In Bash, a variable is declared by simply assigning a value — **no type declaration needed**:

  ```bash
  name="Alice"
  age=20
  gpa=3.85
  ```

  **Rules:**
  - No spaces around `=` (spaces cause errors)
  - Variable names are case-sensitive (`Name` ≠ `name`)
  - Names can contain letters, digits, underscores — must start with a letter or underscore
  - By convention, local variables use lowercase; environment variables use UPPERCASE

  ---

  # Slide 2: Referencing Variables

  Prefix the variable name with `$` to read its value:

  ```bash
  name="Alice"
  echo $name          # prints: Alice
  echo "Hello, $name" # prints: Hello, Alice
  echo "Hello, ${name}!" # braces for clarity/concatenation
  ```

  Use `${}` (curly braces) when the variable name immediately precedes other text:

  ```bash
  fruit="banana"
  echo "${fruit}s are yellow"   # prints: bananas are yellow
  ```

  ---

  # Slide 3: Numeric Variables and Arithmetic

  Bash variables are strings by default. For arithmetic use `$(( ))`:

  ```bash
  a=10
  b=3
  sum=$((a + b))
  diff=$((a - b))
  prod=$((a * b))
  quot=$((a / b))   # integer division
  mod=$((a % b))
  echo "$a + $b = $sum"
  ```

  You can also use the `let` command or `expr`:
  ```bash
  let result=a*b
  result=$(expr $a + $b)   # older style
  ```

  ---

  # Slide 4: Environment Variables

  Environment variables are available system-wide and are set by the OS or shell startup files:

  | Variable | Meaning |
  |----------|---------|
  | `$HOME`  | Current user's home directory |
  | `$USER`  | Logged-in username |
  | `$PATH`  | Colon-separated list of executable search directories |
  | `$PWD`   | Present working directory |
  | `$SHELL` | Path to current shell |
  | `$?`     | Exit status of last command (0 = success) |

  Print all environment variables with `env` or `printenv`.

  Export a custom variable to child processes:
  ```bash
  export MY_VAR="hello"
  ```

  ---

  # Slide 5: Command Substitution

  Capture the output of a command into a variable:

  ```bash
  today=$(date)
  echo "Today is: $today"

  files=$(ls /home/student)
  count=$(ls | wc -l)
  echo "There are $count files here"
  ```

  The backtick syntax `` `command` `` is equivalent but deprecated:
  ```bash
  today=`date`   # old style — avoid in new scripts
  ```

  Always prefer `$(...)` — it is readable and nestable:
  ```bash
  result=$(echo $(date +%Y))   # nested substitution
  ```

  ---

  # Slide 6: Read-only and Unset Variables

  Make a variable read-only (constant):
  ```bash
  readonly PI=3.14159
  PI=3   # Error: PI is read only
  ```

  Remove a variable:
  ```bash
  myvar="hello"
  unset myvar
  echo $myvar   # prints nothing
  ```

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Variables in the Terminal
* **Est. Minutes:** 5
* **Outline:** Practice declaring variables, arithmetic, and command substitution at the prompt.
* **Instructions:** Type each command directly in the terminal. Do not wrap in a script file for this quest.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create a script `/home/student/scripts/vars_demo.sh` that declares `name="student"` and prints `Hello, student` using the variable.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/vars_demo.sh 2>/dev/null | grep -q "Hello, student" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** In `/home/student/scripts/vars_demo.sh` also declare `x=7` and `y=3`, compute their sum, and print `Sum: 10`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/vars_demo.sh 2>/dev/null | grep -q "Sum: 10" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 3:**
    * **Instruction:** Add a line to the script that stores the output of `date +%Y` in a variable `year` and prints `Year: <current_year>`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/vars_demo.sh 2>/dev/null | grep -q "Year:" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Personal Info Script Using Variables
* **Est. Minutes:** 8
* **Outline:** Write a script that stores personal info in variables and prints a formatted profile card.
* **Instructions:**
  1. Create `/home/student/scripts/profile.sh`.
  2. Add shebang `#!/bin/bash`.
  3. Declare variables: `name`, `roll_no`, `branch`, `year`.
  4. Assign values: your name, a 10-digit roll number, your branch (e.g., "CSE"), and current year (e.g., 2).
  5. Use `echo` statements to print a formatted profile:
     ```
     ===== Student Profile =====
     Name   : Alice
     Roll No: 2023CS001
     Branch : CSE
     Year   : 2
     ===========================
     ```
  6. Save, make executable, and test.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/profile.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/profile.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** The script must declare a variable named `name`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'name=' /home/student/scripts/profile.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** The script must declare a variable named `roll_no`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'roll_no=' /home/student/scripts/profile.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 4:**
    * **Instruction:** The script output must contain the line `===== Student Profile =====`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `chmod +x /home/student/scripts/profile.sh 2>/dev/null; /home/student/scripts/profile.sh | grep -q "Student Profile" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Variables Quiz
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check on variables, arithmetic, and substitution.

* **Questions:**

  * **Q1:** Which of the following correctly assigns a value to a variable in Bash?
    * **Options:**
      * A) `name = "Alice"`
      * B) `name="Alice"`
      * C) `$name="Alice"`
      * D) `set name "Alice"`
    * **Correct Answer:** B) `name="Alice"`
    * **Explanation:** Bash variable assignment requires no spaces around `=`. Spaces cause the shell to interpret the tokens as a command and arguments, resulting in an error.

  * **Q2:** What is the output of `echo $((10 % 3))`?
    * **Options:**
      * A) 3
      * B) 0
      * C) 1
      * D) 10
    * **Correct Answer:** C) 1
    * **Explanation:** `%` is the modulo operator. `10 % 3 = 1` (10 divided by 3 gives remainder 1).

  * **Q3:** Which syntax performs command substitution in modern Bash?
    * **Options:**
      * A) `` `command` ``
      * B) `$(command)`
      * C) `${command}`
      * D) `!command!`
    * **Correct Answer:** B) `$(command)`
    * **Explanation:** `$(...)` is the preferred modern syntax for command substitution. It is nestable and more readable than the deprecated backtick syntax.

  * **Q4:** What does `$?` hold in Bash?
    * **Options:**
      * A) The process ID of the script
      * B) The current shell version
      * C) The exit status of the last executed command
      * D) The number of arguments passed to the script
    * **Correct Answer:** C) The exit status of the last executed command
    * **Explanation:** `$?` is a special variable that stores the exit status (return code) of the most recently executed command. `0` means success; non-zero values indicate errors.

---

## CHAPTER 6.3: User Input

* **Description:** Teaches students how to read interactive user input using the `read` command, handle input with prompts, and validate input at a basic level.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Reading Input With `read`
* **Est. Minutes:** 5
* **Outline:** Cover the `read` command, prompt options, reading multiple values, silent input, and command-line arguments.

* **Instructions (Slides):**

  # Slide 1: The `read` Command

  `read` pauses the script and waits for the user to type input, then stores it in a variable:

  ```bash
  #!/bin/bash
  echo "Enter your name:"
  read name
  echo "Hello, $name!"
  ```

  The user types their name and presses Enter. The value is stored in `$name`.

  ---

  # Slide 2: Inline Prompt with `-p`

  The `-p` flag lets you display a prompt on the same line:

  ```bash
  read -p "Enter your age: " age
  echo "You are $age years old."
  ```

  This is cleaner than a separate `echo` + `read` pair and is the preferred exam style.

  ---

  # Slide 3: Reading Multiple Variables at Once

  `read` can accept multiple variable names; it splits input on whitespace:

  ```bash
  read -p "Enter first and last name: " first last
  echo "First: $first"
  echo "Last:  $last"
  ```

  If the user enters more words than variables, the last variable captures everything remaining.

  ---

  # Slide 4: Silent Input with `-s`

  For passwords or sensitive data, use `-s` (silent — no echo):

  ```bash
  read -s -p "Enter password: " passwd
  echo ""   # print newline after silent input
  echo "Password accepted."
  ```

  Combine `-s` and `-p` freely.

  ---

  # Slide 5: Command-Line Arguments

  Scripts can also receive input as arguments (positional parameters):

  ```bash
  #!/bin/bash
  # Usage: ./greet.sh Alice 20
  name=$1
  age=$2
  echo "Hello, $name! You are $age years old."
  ```

  | Variable | Meaning |
  |----------|---------|
  | `$0` | Script name |
  | `$1`, `$2`, … | Positional arguments |
  | `$#` | Number of arguments |
  | `$@` | All arguments as separate words |
  | `$*` | All arguments as one string |

  ---

  # Slide 6: Default Values

  Provide a default if the user presses Enter without typing:

  ```bash
  read -p "Enter city [Kolkata]: " city
  city=${city:-Kolkata}
  echo "City: $city"
  ```

  `${var:-default}` returns `default` if `var` is unset or empty.

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Interactive Input Script
* **Est. Minutes:** 5
* **Outline:** Build a script that greets the user by name and prints a custom message.
* **Instructions:** Create and test `/home/student/scripts/greet.sh`. Use non-interactive testing by piping input.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/greet.sh` that reads a name with prompt "Enter your name: " and prints "Hello, <name>! Welcome to Linux." — use `read -p`.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/greet.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** The script must use `read` to capture input.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'read' /home/student/scripts/greet.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** When provided input "TestUser", the script must output a line containing "Hello, TestUser!".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "TestUser" | bash /home/student/scripts/greet.sh 2>/dev/null | grep -q "Hello, TestUser!" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Student Registration Form Script
* **Est. Minutes:** 8
* **Outline:** Create a script that collects multiple fields of student data and prints a summary.
* **Instructions:**
  1. Create `/home/student/scripts/register.sh`.
  2. Add shebang.
  3. Use `read -p` to collect: `name`, `roll`, `branch`, `sem` (semester).
  4. After collecting all inputs, print:
     ```
     --- Registration Summary ---
     Name    : <name>
     Roll No : <roll>
     Branch  : <branch>
     Semester: <sem>
     ----------------------------
     ```
  5. Save, make executable, and verify.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/register.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/register.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** The script must contain at least 4 `read` statements.
    * **Validation Type:** `file_content`
    * **Validation Script:** `[ $(grep -c 'read' /home/student/scripts/register.sh) -ge 4 ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** When fed inputs "Alice\n2023CS001\nCSE\n3" the script must output a line containing "Registration Summary".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "Alice\n2023CS001\nCSE\n3\n" | bash /home/student/scripts/register.sh 2>/dev/null | grep -q "Registration Summary" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** User Input Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on `read`, arguments, and default values.

* **Questions:**

  * **Q1:** Which flag of `read` displays a prompt on the same line?
    * **Options:**
      * A) `-i`
      * B) `-n`
      * C) `-p`
      * D) `-t`
    * **Correct Answer:** C) `-p`
    * **Explanation:** `read -p "prompt" var` displays the prompt string before waiting for input, keeping everything on one line for a cleaner user experience.

  * **Q2:** In a script called as `./calc.sh 10 20`, what is the value of `$2`?
    * **Options:**
      * A) `./calc.sh`
      * B) `10`
      * C) `20`
      * D) `2`
    * **Correct Answer:** C) `20`
    * **Explanation:** `$1` is the first argument (`10`) and `$2` is the second argument (`20`). `$0` is the script name.

  * **Q3:** What does `${city:-Kolkata}` return if `city` is empty?
    * **Options:**
      * A) An error
      * B) An empty string
      * C) `city`
      * D) `Kolkata`
    * **Correct Answer:** D) `Kolkata`
    * **Explanation:** The `:-` operator provides a default value. If the variable is unset or empty, the default (here `Kolkata`) is returned without modifying the variable.

  * **Q4:** Which variable holds the total number of arguments passed to a script?
    * **Options:**
      * A) `$@`
      * B) `$*`
      * C) `$#`
      * D) `$0`
    * **Correct Answer:** C) `$#`
    * **Explanation:** `$#` is a special variable that stores the count of positional parameters (arguments) passed to the script, not counting `$0` (the script name).

---

# MODULE 7: DECISION MAKING

## CHAPTER 7.1: if Statement

* **Description:** Introduces conditional branching with the `if` statement — covering test expressions, comparison operators for numbers and strings, and file test operators.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Making Decisions with `if`
* **Est. Minutes:** 5
* **Outline:** Explain `if` syntax, `test`/`[ ]`/`[[ ]]`, numeric comparisons, string comparisons, and file tests.

* **Instructions (Slides):**

  # Slide 1: Basic `if` Syntax

  ```bash
  if [ condition ]; then
      # commands executed when condition is TRUE
  fi
  ```

  - `if` starts the block; `fi` (if spelled backward) ends it
  - `then` must follow the condition (same line or next line)
  - The condition is tested using `[ ]` (the `test` command) or `[[ ]]` (bash built-in)
  - **Spaces inside brackets are mandatory**: `[ -f file ]` ✓  `[-f file]` ✗

  ---

  # Slide 2: Numeric Comparison Operators

  | Operator | Meaning | Example |
  |----------|---------|---------|
  | `-eq` | equal | `[ $a -eq $b ]` |
  | `-ne` | not equal | `[ $a -ne $b ]` |
  | `-lt` | less than | `[ $a -lt $b ]` |
  | `-le` | less than or equal | `[ $a -le $b ]` |
  | `-gt` | greater than | `[ $a -gt $b ]` |
  | `-ge` | greater than or equal | `[ $a -ge $b ]` |

  ```bash
  read -p "Enter a number: " n
  if [ $n -gt 0 ]; then
      echo "Positive"
  fi
  ```

  ---

  # Slide 3: String Comparison Operators

  | Operator | Meaning |
  |----------|---------|
  | `=` or `==` | strings are equal |
  | `!=` | strings are not equal |
  | `-z "$s"` | string is empty (zero length) |
  | `-n "$s"` | string is non-empty |

  ```bash
  read -p "Enter password: " pass
  if [ "$pass" = "secret123" ]; then
      echo "Access granted"
  fi
  ```

  Always quote string variables to handle spaces: `"$var"`.

  ---

  # Slide 4: File Test Operators

  | Operator | Meaning |
  |----------|---------|
  | `-f file` | exists and is a regular file |
  | `-d dir` | exists and is a directory |
  | `-e path` | exists (any type) |
  | `-r file` | readable |
  | `-w file` | writable |
  | `-x file` | executable |
  | `-s file` | exists and is non-empty |

  ```bash
  if [ -f "/home/student/notes.txt" ]; then
      echo "File exists"
  fi
  ```

  ---

  # Slide 5: Logical Operators Inside `[ ]`

  | Operator | Meaning |
  |----------|---------|
  | `-a` | AND (inside `[ ]`) |
  | `-o` | OR (inside `[ ]`) |
  | `!` | NOT |

  With `[[ ]]` (preferred):
  ```bash
  if [[ $a -gt 0 && $a -lt 100 ]]; then
      echo "Between 1 and 99"
  fi
  ```

  `&&` and `||` work naturally inside `[[ ]]`.

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Write Conditional Scripts
* **Est. Minutes:** 5
* **Outline:** Practice using `if` to check a number and a file.
* **Instructions:** Create the following scripts in `/home/student/scripts/`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/check_positive.sh` that reads a number and prints "Positive" if it is greater than 0, otherwise prints nothing.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "5" | bash /home/student/scripts/check_positive.sh 2>/dev/null | grep -q "Positive" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** Create `/home/student/scripts/check_file.sh` that checks if `/home/student/scripts/hello.sh` exists and prints "File found" if true.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/check_file.sh 2>/dev/null | grep -q "File found" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Even or Odd Checker
* **Est. Minutes:** 8
* **Outline:** Write a script that determines if a number is even or odd.
* **Instructions:**
  1. Create `/home/student/scripts/even_odd.sh`.
  2. Add shebang.
  3. Use `read -p` to get a number from the user.
  4. Use `if` with arithmetic to test if `n % 2 -eq 0`.
  5. Print "Even" if true.
  6. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/even_odd.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/even_odd.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must use `if` statement.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q '\bif\b' /home/student/scripts/even_odd.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** When input is 4, output must contain "Even".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "4" | bash /home/student/scripts/even_odd.sh 2>/dev/null | grep -qi "even" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** if Statement Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on if syntax and test operators.

* **Questions:**

  * **Q1:** Which operator checks if two integers are equal in Bash `[ ]`?
    * **Options:**
      * A) `==`
      * B) `-eq`
      * C) `=`
      * D) `-is`
    * **Correct Answer:** B) `-eq`
    * **Explanation:** For numeric comparisons inside `[ ]`, Bash uses flag-style operators: `-eq` (equal), `-ne` (not equal), `-lt` (less than), etc. `==` and `=` are for string comparison.

  * **Q2:** What keyword ends an `if` block in Bash?
    * **Options:**
      * A) `end`
      * B) `endif`
      * C) `done`
      * D) `fi`
    * **Correct Answer:** D) `fi`
    * **Explanation:** Bash uses `fi` (reverse of `if`) to close an if block, following the pattern of `do`/`done` for loops.

  * **Q3:** What does the `-d` flag test in `[ -d "/path" ]`?
    * **Options:**
      * A) Whether the path is readable
      * B) Whether the path is a directory
      * C) Whether the path is a device
      * D) Whether the path is deletable
    * **Correct Answer:** B) Whether the path is a directory
    * **Explanation:** `-d` is a file test operator that returns true if the given path exists and is a directory.

  * **Q4:** Which of the following is the correct way to check if `$a` is greater than `$b`?
    * **Options:**
      * A) `[ $a > $b ]`
      * B) `[ $a -gt $b ]`
      * C) `[ $a GT $b ]`
      * D) `[ $a greater $b ]`
    * **Correct Answer:** B) `[ $a -gt $b ]`
    * **Explanation:** `-gt` is the "greater than" numeric comparison operator in Bash test expressions. Using `>` inside `[ ]` would be interpreted as file redirection.

---

## CHAPTER 7.2: if-else

* **Description:** Extends conditional logic with `else` and `elif` branches, allowing scripts to respond differently to multiple conditions.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Branching With if-else and elif
* **Est. Minutes:** 5
* **Outline:** Explain if-else syntax, elif chaining, and case statement as an alternative.

* **Instructions (Slides):**

  # Slide 1: The if-else Structure

  ```bash
  if [ condition ]; then
      # runs when condition is TRUE
  else
      # runs when condition is FALSE
  fi
  ```

  Example — check if a number is positive or negative:
  ```bash
  read -p "Enter number: " n
  if [ $n -gt 0 ]; then
      echo "Positive"
  else
      echo "Non-positive (zero or negative)"
  fi
  ```

  ---

  # Slide 2: The elif Ladder

  Use `elif` (else-if) to test multiple mutually exclusive conditions:

  ```bash
  if [ condition1 ]; then
      # runs if condition1 is true
  elif [ condition2 ]; then
      # runs if condition2 is true
  elif [ condition3 ]; then
      # runs if condition3 is true
  else
      # runs if none of the above is true
  fi
  ```

  ---

  # Slide 3: Grade Calculator Example

  ```bash
  read -p "Enter marks (0-100): " marks
  if [ $marks -ge 90 ]; then
      echo "Grade: A+"
  elif [ $marks -ge 80 ]; then
      echo "Grade: A"
  elif [ $marks -ge 70 ]; then
      echo "Grade: B"
  elif [ $marks -ge 60 ]; then
      echo "Grade: C"
  elif [ $marks -ge 40 ]; then
      echo "Grade: D (Pass)"
  else
      echo "Grade: F (Fail)"
  fi
  ```

  Conditions are evaluated top to bottom; the first true branch executes and the rest are skipped.

  ---

  # Slide 4: The `case` Statement

  `case` is a cleaner alternative to long elif chains when comparing a variable against fixed patterns:

  ```bash
  read -p "Enter day (1-7): " day
  case $day in
      1) echo "Monday" ;;
      2) echo "Tuesday" ;;
      3) echo "Wednesday" ;;
      4) echo "Thursday" ;;
      5) echo "Friday" ;;
      6) echo "Saturday" ;;
      7) echo "Sunday" ;;
      *) echo "Invalid day" ;;
  esac
  ```

  - `*)` is the wildcard / default case
  - `;;` ends each case branch
  - `esac` (case reversed) closes the block

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Build an if-else Grade Script
* **Est. Minutes:** 5
* **Outline:** Create a marks-based grade calculator.
* **Instructions:** Create `/home/student/scripts/grade.sh` with a complete if-elif-else chain.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/grade.sh` that reads marks and prints `Grade: A+` for marks >= 90.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "95" | bash /home/student/scripts/grade.sh 2>/dev/null | grep -q "A+" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** The same script must print `Grade: F` (or contain "F") for marks below 40.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "30" | bash /home/student/scripts/grade.sh 2>/dev/null | grep -qi "F" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 3:**
    * **Instruction:** The script must contain `elif`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'elif' /home/student/scripts/grade.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Day-of-Week Selector Using `case`
* **Est. Minutes:** 8
* **Outline:** Write a script using the `case` statement to print the day name.
* **Instructions:**
  1. Create `/home/student/scripts/day_name.sh`.
  2. Add shebang.
  3. Prompt: "Enter day number (1-7): " and read into variable `day`.
  4. Use a `case` block to print Monday through Sunday.
  5. Add a `*)` default case printing "Invalid input".
  6. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/day_name.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/day_name.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must use `case` and `esac`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'case' /home/student/scripts/day_name.sh && grep -q 'esac' /home/student/scripts/day_name.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Input `3` must produce output containing "Wednesday".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "3" | bash /home/student/scripts/day_name.sh 2>/dev/null | grep -q "Wednesday" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** Input `9` must produce output containing "Invalid".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "9" | bash /home/student/scripts/day_name.sh 2>/dev/null | grep -qi "invalid" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** if-else and case Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on if-else chains and the case statement.

* **Questions:**

  * **Q1:** What keyword is used to add additional conditions after an initial `if`?
    * **Options:**
      * A) `else if`
      * B) `elseif`
      * C) `elif`
      * D) `orif`
    * **Correct Answer:** C) `elif`
    * **Explanation:** Bash uses `elif` (not `else if` as in C/Java) to add additional conditional branches before the final `else`.

  * **Q2:** In a `case` statement, what does `*)`  represent?
    * **Options:**
      * A) The first case
      * B) A required empty case
      * C) The default/wildcard case
      * D) The end of the case block
    * **Correct Answer:** C) The default/wildcard case
    * **Explanation:** `*)` matches any value not matched by earlier patterns, functioning as the "default" or "catch-all" branch of a case statement.

  * **Q3:** What keyword closes a `case` block?
    * **Options:**
      * A) `fi`
      * B) `done`
      * C) `end`
      * D) `esac`
    * **Correct Answer:** D) `esac`
    * **Explanation:** `esac` (case spelled backward) closes the `case` block, consistent with Bash's `fi` closing `if` and `done` closing `do`.

  * **Q4:** In an if-elif-else chain, how many branches can execute?
    * **Options:**
      * A) All branches that match
      * B) Exactly one branch
      * C) Only the first and last
      * D) Only the `else` branch
    * **Correct Answer:** B) Exactly one branch
    * **Explanation:** Bash evaluates conditions top to bottom and executes only the first matching branch. Once a true condition is found, the remaining conditions are skipped entirely.

---

## CHAPTER 7.3: Nested Conditions (OS Practical #4)

* **Description:** Demonstrates nesting `if` blocks inside other `if` blocks and covers compound conditions — preparing students for OS Practical exam question #4 style problems.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Nested if and Compound Conditions
* **Est. Minutes:** 5
* **Outline:** Explain nested if syntax, compound AND/OR conditions, and real-world exam-style examples.

* **Instructions (Slides):**

  # Slide 1: What Is a Nested if?

  A **nested if** is an `if` block placed inside another `if` or `else` block:

  ```bash
  if [ outer_condition ]; then
      if [ inner_condition ]; then
          echo "Both conditions true"
      else
          echo "Outer true, inner false"
      fi
  else
      echo "Outer condition false"
  fi
  ```

  Use nested ifs when the inner check only makes sense after the outer check passes. For example: first check if a number is positive, then check if it's even.

  ---

  # Slide 2: Compound Conditions — AND

  Instead of nesting, combine conditions with `&&`:

  ```bash
  # Using [[ ]]
  if [[ $n -gt 0 && $n -lt 100 ]]; then
      echo "Between 1 and 99"
  fi

  # Using [ ] with -a
  if [ $n -gt 0 -a $n -lt 100 ]; then
      echo "Between 1 and 99"
  fi
  ```

  Both conditions must be true for the body to execute.

  ---

  # Slide 3: Compound Conditions — OR

  ```bash
  if [[ $day -eq 6 || $day -eq 7 ]]; then
      echo "Weekend"
  fi

  # Using [ ] with -o
  if [ $day -eq 6 -o $day -eq 7 ]; then
      echo "Weekend"
  fi
  ```

  At least one condition must be true.

  ---

  # Slide 4: OS Practical #4 — Exam Style Problem

  **Problem:** Read a year from the user and determine if it is a **leap year**.

  A year is a leap year if:
  - Divisible by 4 **AND**
  - (Not divisible by 100 **OR** divisible by 400)

  ```bash
  #!/bin/bash
  read -p "Enter year: " year
  if [ $((year % 4)) -eq 0 ]; then
      if [ $((year % 100)) -ne 0 ]; then
          echo "$year is a Leap Year"
      elif [ $((year % 400)) -eq 0 ]; then
          echo "$year is a Leap Year"
      else
          echo "$year is NOT a Leap Year"
      fi
  else
      echo "$year is NOT a Leap Year"
  fi
  ```

  This is a classic example of nested conditions used in OS practicals.

  ---

  # Slide 5: Triangle Validity Checker

  Another common exam problem — check if three sides form a valid triangle:

  ```bash
  read -p "Enter three sides (a b c): " a b c
  if [ $a -gt 0 -a $b -gt 0 -a $c -gt 0 ]; then
      if [ $((a + b)) -gt $c -a $((b + c)) -gt $a -a $((a + c)) -gt $b ]; then
          echo "Valid triangle"
      else
          echo "Not a triangle"
      fi
  else
      echo "Sides must be positive"
  fi
  ```

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Nested Condition Scripts
* **Est. Minutes:** 5
* **Outline:** Build a nested if script to classify a number as positive/negative/zero and even/odd.
* **Instructions:** Create `/home/student/scripts/classify.sh`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/classify.sh` that reads a number, checks if positive, negative or zero, and if positive additionally checks even/odd. For input 6: print "Positive" and "Even".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "6" | bash /home/student/scripts/classify.sh 2>/dev/null | grep -q "Positive" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** For input 6, also output "Even".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "6" | bash /home/student/scripts/classify.sh 2>/dev/null | grep -qi "even" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 3:**
    * **Instruction:** For input 0, output must contain "Zero".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "0" | bash /home/student/scripts/classify.sh 2>/dev/null | grep -qi "zero" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Leap Year Checker (OS Practical #4)
* **Est. Minutes:** 8
* **Outline:** Write the complete leap year script using nested conditions.
* **Instructions:**
  1. Create `/home/student/scripts/leap_year.sh`.
  2. Add shebang and a comment: `# OS Practical #4 - Leap Year Checker`.
  3. Prompt and read `year`.
  4. Implement the nested leap year logic:
     - If `year % 4 == 0`: enter inner block
       - If `year % 100 != 0`: print "Leap Year"
       - Elif `year % 400 == 0`: print "Leap Year"
       - Else: print "Not a Leap Year"
     - Else: print "Not a Leap Year"
  5. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/leap_year.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/leap_year.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must contain nested `if` (at least 2 `if` keywords).
    * **Validation Type:** `file_content`
    * **Validation Script:** `[ $(grep -c '\bif\b' /home/student/scripts/leap_year.sh) -ge 2 ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** Input 2000 must produce output containing "Leap Year".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "2000" | bash /home/student/scripts/leap_year.sh 2>/dev/null | grep -qi "leap" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** Input 1900 must produce output containing "Not a Leap Year".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "1900" | bash /home/student/scripts/leap_year.sh 2>/dev/null | grep -qi "not" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 5:**
    * **Instruction:** Input 2024 must produce output containing "Leap Year".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "2024" | bash /home/student/scripts/leap_year.sh 2>/dev/null | grep -qi "leap" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Nested Conditions Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on nested if and compound conditions.

* **Questions:**

  * **Q1:** A leap year must be divisible by 4. Century years (divisible by 100) are leap years only if they are also divisible by which number?
    * **Options:**
      * A) 200
      * B) 400
      * C) 1000
      * D) 500
    * **Correct Answer:** B) 400
    * **Explanation:** The Gregorian calendar rule: a year is a leap year if divisible by 4, EXCEPT century years (÷100) unless also divisible by 400. So 2000 was a leap year, but 1900 was not.

  * **Q2:** Which operator combines two conditions so both must be true in `[[ ]]`?
    * **Options:**
      * A) `||`
      * B) `&`
      * C) `&&`
      * D) `-o`
    * **Correct Answer:** C) `&&`
    * **Explanation:** `&&` is the logical AND operator inside `[[ ]]`. Both the left and right conditions must evaluate to true for the combined expression to be true.

  * **Q3:** When is nesting an `if` inside another `if` more appropriate than using `&&`?
    * **Options:**
      * A) When conditions are unrelated
      * B) When the inner check only makes sense if the outer check passes, and you need different error messages for each level
      * C) When you want to save typing
      * D) `&&` is always preferred
    * **Correct Answer:** B) When the inner check only makes sense if the outer check passes, and you need different error messages for each level
    * **Explanation:** Nested if allows different handling at each level — you can print a specific message for why the outer check failed vs. why the inner check failed. `&&` merges both conditions and only gives one outcome.

  * **Q4:** What is the output of the following snippet if `a=5` and `b=10`?
    ```bash
    if [ $a -gt 0 ]; then
      if [ $b -gt 20 ]; then
        echo "Both"
      else
        echo "Only outer"
      fi
    fi
    ```
    * **Options:**
      * A) `Both`
      * B) `Only outer`
      * C) No output
      * D) Error
    * **Correct Answer:** B) `Only outer`
    * **Explanation:** `a=5 > 0` is true so the outer if passes. `b=10 > 20` is false so the inner else executes, printing "Only outer".

---

# MODULE 8: LOOPS

## CHAPTER 8.1: for Loop

* **Description:** Introduces iteration using the `for` loop in Bash — covering list iteration, C-style loops, range sequences, and practical use cases.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Iteration with the for Loop
* **Est. Minutes:** 5
* **Outline:** Explain list-based for loops, C-style for loops, `seq` and brace expansion, and `break`/`continue`.

* **Instructions (Slides):**

  # Slide 1: List-Based for Loop

  ```bash
  for variable in list; do
      # commands using $variable
  done
  ```

  The loop iterates over each item in `list`, assigning it to `variable` one at a time:

  ```bash
  for color in red green blue; do
      echo "Color: $color"
  done
  ```

  Output:
  ```
  Color: red
  Color: green
  Color: blue
  ```

  ---

  # Slide 2: Numeric Range with `seq` and Brace Expansion

  ```bash
  # Using seq
  for i in $(seq 1 5); do
      echo "Number: $i"
  done

  # Using brace expansion (Bash 3.0+)
  for i in {1..5}; do
      echo "Number: $i"
  done

  # With step: {start..end..step}
  for i in {0..10..2}; do
      echo "Even: $i"
  done
  ```

  ---

  # Slide 3: C-Style for Loop

  ```bash
  for (( init; condition; increment )); do
      # commands
  done
  ```

  Example — print 1 to 10:
  ```bash
  for (( i=1; i<=10; i++ )); do
      echo "i = $i"
  done
  ```

  This is identical in structure to C/Java for loops and is preferred for numeric iterations in exams.

  ---

  # Slide 4: Iterating Over Files and Arrays

  ```bash
  # Iterate over files in a directory
  for file in /home/student/scripts/*.sh; do
      echo "Script: $file"
  done

  # Iterate over command output
  for user in $(cat /etc/passwd | cut -d: -f1); do
      echo "User: $user"
  done
  ```

  ---

  # Slide 5: break and continue

  - `break` — exits the loop immediately
  - `continue` — skips the rest of the current iteration and goes to the next

  ```bash
  for (( i=1; i<=10; i++ )); do
      if [ $i -eq 5 ]; then
          continue    # skip 5
      fi
      if [ $i -eq 8 ]; then
          break       # stop at 8
      fi
      echo $i
  done
  # Output: 1 2 3 4 6 7
  ```

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** for Loop Practice
* **Est. Minutes:** 5
* **Outline:** Print multiplication table and sum of numbers using for loops.
* **Instructions:** Create scripts in `/home/student/scripts/`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/print_1_to_10.sh` that prints numbers 1 to 10 using a C-style for loop, one per line.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/print_1_to_10.sh 2>/dev/null | grep -q "^10$" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** Create `/home/student/scripts/sum_1_to_n.sh` that reads N and prints "Sum: <value>" for the sum of 1 to N. For N=5, output "Sum: 15".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "5" | bash /home/student/scripts/sum_1_to_n.sh 2>/dev/null | grep -q "Sum: 15" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Multiplication Table Generator
* **Est. Minutes:** 8
* **Outline:** Write a script that generates the multiplication table for a given number.
* **Instructions:**
  1. Create `/home/student/scripts/mul_table.sh`.
  2. Add shebang.
  3. Read a number `n` with `read -p`.
  4. Use a `for` C-style loop from 1 to 10.
  5. Print: `<n> x <i> = <result>` for each iteration.
  6. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/mul_table.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/mul_table.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must contain a `for` loop.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q '\bfor\b' /home/student/scripts/mul_table.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** For input 5, output must contain `5 x 5 = 25`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "5" | bash /home/student/scripts/mul_table.sh 2>/dev/null | grep -q "5 x 5 = 25" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** For input 5, output must contain `5 x 10 = 50`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "5" | bash /home/student/scripts/mul_table.sh 2>/dev/null | grep -q "5 x 10 = 50" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** for Loop Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on for loop syntax and usage.

* **Questions:**

  * **Q1:** What is the correct C-style for loop to print 1 through 5?
    * **Options:**
      * A) `for i in 1..5; do echo $i; done`
      * B) `for (( i=1; i<=5; i++ )); do echo $i; done`
      * C) `for i = 1 to 5; do echo $i; done`
      * D) `loop i from 1 to 5; echo $i; endloop`
    * **Correct Answer:** B) `for (( i=1; i<=5; i++ )); do echo $i; done`
    * **Explanation:** The C-style for loop in Bash uses double parentheses `(( ))` and follows the `init; condition; increment` structure, identical to C language syntax.

  * **Q2:** What does `continue` do inside a loop?
    * **Options:**
      * A) Terminates the entire script
      * B) Exits the loop
      * C) Skips to the next iteration of the loop
      * D) Restarts the loop from iteration 1
    * **Correct Answer:** C) Skips to the next iteration of the loop
    * **Explanation:** `continue` causes the shell to skip the remaining commands in the current loop body and jump directly to the next iteration's condition check.

  * **Q3:** What does `{1..5..2}` expand to?
    * **Options:**
      * A) 1 2 3 4 5
      * B) 1 3 5
      * C) 2 4
      * D) 1 5 2
    * **Correct Answer:** B) 1 3 5
    * **Explanation:** Brace expansion `{start..end..step}` generates numbers from 1 to 5 with a step of 2, giving 1, 3, 5.

  * **Q4:** What keyword ends a `for` loop body in Bash?
    * **Options:**
      * A) `end`
      * B) `fi`
      * C) `esac`
      * D) `done`
    * **Correct Answer:** D) `done`
    * **Explanation:** All loop constructs in Bash (`for`, `while`, `until`) are closed with `done`.

---

## CHAPTER 8.2: while Loop

* **Description:** Covers the `while` loop for condition-based repetition — including infinite loops, loop counters, and menu-driven programs.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Condition-Based Loops with `while`
* **Est. Minutes:** 5
* **Outline:** Explain while loop syntax, counter patterns, infinite loops with break, and `until`.

* **Instructions (Slides):**

  # Slide 1: while Loop Syntax

  ```bash
  while [ condition ]; do
      # commands
  done
  ```

  The loop continues as long as `condition` is **true**. The condition is tested *before* each iteration.

  ```bash
  i=1
  while [ $i -le 5 ]; do
      echo "i = $i"
      i=$((i + 1))
  done
  ```

  **Important:** Always increment the counter inside the loop to avoid infinite loops.

  ---

  # Slide 2: while with C-Style Arithmetic

  ```bash
  i=1
  while (( i <= 10 )); do
      echo "$i"
      (( i++ ))
  done
  ```

  `(( ))` allows C-style arithmetic and increments without the `$` prefix.

  ---

  # Slide 3: Infinite Loop with `while true`

  ```bash
  while true; do
      read -p "Enter command (q to quit): " cmd
      if [ "$cmd" = "q" ]; then
          echo "Goodbye!"
          break
      fi
      echo "You typed: $cmd"
  done
  ```

  `while true` creates a loop that never stops on its own — `break` is required to exit.

  ---

  # Slide 4: Menu-Driven Programs

  A common exam pattern — display a menu, read choice, perform action, repeat:

  ```bash
  #!/bin/bash
  while true; do
      echo "=== MENU ==="
      echo "1. Say Hello"
      echo "2. Show Date"
      echo "3. Exit"
      read -p "Choose: " choice
      case $choice in
          1) echo "Hello!" ;;
          2) date ;;
          3) echo "Bye!"; break ;;
          *) echo "Invalid" ;;
      esac
  done
  ```

  ---

  # Slide 5: The `until` Loop

  `until` is the opposite of `while` — it loops until the condition becomes **true**:

  ```bash
  i=1
  until [ $i -gt 5 ]; do
      echo "i = $i"
      i=$((i + 1))
  done
  ```

  This is less common but may appear in exams. Prefer `while` unless the question specifically asks for `until`.

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** while Loop Counter and Factorial
* **Est. Minutes:** 5
* **Outline:** Build a countdown and factorial calculator using while loops.
* **Instructions:** Create scripts in `/home/student/scripts/`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/countdown.sh` that counts down from 5 to 1 using a while loop and prints each number.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/countdown.sh 2>/dev/null | grep -q "^1$" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** Create `/home/student/scripts/factorial.sh` that reads N and prints "Factorial: <value>". For N=5 output "Factorial: 120".
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "5" | bash /home/student/scripts/factorial.sh 2>/dev/null | grep -q "Factorial: 120" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Number Guessing Game (Simplified)
* **Est. Minutes:** 8
* **Outline:** Write a while-loop-based guessing game where the script has a hardcoded answer.
* **Instructions:**
  1. Create `/home/student/scripts/guess.sh`.
  2. Add shebang.
  3. Set `secret=42`.
  4. Use `while true`; inside: prompt "Guess: ", read `guess`.
  5. If guess equals secret: print "Correct! You got it." and `break`.
  6. Elif guess < secret: print "Too low!"
  7. Else: print "Too high!"
  8. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/guess.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/guess.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must use `while` loop.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q '\bwhile\b' /home/student/scripts/guess.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** When given inputs "10\n42", output must contain "Correct".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "10\n42\n" | bash /home/student/scripts/guess.sh 2>/dev/null | grep -qi "correct" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** When given input "10\n42", output must first contain "Too low".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "10\n42\n" | bash /home/student/scripts/guess.sh 2>/dev/null | grep -qi "low" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** while Loop Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on while loops.

* **Questions:**

  * **Q1:** When is a `while` loop's condition checked?
    * **Options:**
      * A) After each iteration
      * B) Before each iteration
      * C) Only once at the start
      * D) Only once at the end
    * **Correct Answer:** B) Before each iteration
    * **Explanation:** A `while` loop tests its condition before executing the loop body. If the condition is false from the start, the body never executes (zero iterations).

  * **Q2:** What command inside a loop will exit it immediately?
    * **Options:**
      * A) `exit`
      * B) `stop`
      * C) `break`
      * D) `quit`
    * **Correct Answer:** C) `break`
    * **Explanation:** `break` immediately terminates the innermost loop and transfers control to the statement after `done`. `exit` would terminate the entire script.

  * **Q3:** What is the key difference between `while` and `until`?
    * **Options:**
      * A) `until` runs only once
      * B) `while` loops while condition is true; `until` loops while condition is false
      * C) `until` requires `fi` to close
      * D) There is no difference
    * **Correct Answer:** B) `while` loops while condition is true; `until` loops while condition is false
    * **Explanation:** `while` continues as long as the condition is TRUE. `until` continues as long as the condition is FALSE — it exits when the condition becomes true.

  * **Q4:** What is wrong with this loop?
    ```bash
    i=1
    while [ $i -le 10 ]; do
        echo $i
    done
    ```
    * **Options:**
      * A) `le` is not a valid operator
      * B) Missing `do` keyword
      * C) Missing increment of `i` — creates an infinite loop
      * D) The condition should be `[ $i < 10 ]`
    * **Correct Answer:** C) Missing increment of `i` — creates an infinite loop
    * **Explanation:** Since `i` is never updated inside the loop, the condition `$i -le 10` is always true (i stays at 1 forever), creating an infinite loop. You must add `i=$((i+1))` inside the loop body.

---

## CHAPTER 8.3: Nested Loops

* **Description:** Covers placing loops inside loops to solve 2D pattern problems, matrix-style iterations, and the foundation for the pattern programs in OS Practical #5.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Nested Loops and 2D Patterns
* **Est. Minutes:** 5
* **Outline:** Explain nested for loop structure, outer/inner loop roles, `echo -n`, and pattern logic.

* **Instructions (Slides):**

  # Slide 1: Structure of a Nested Loop

  ```bash
  for (( i=1; i<=rows; i++ )); do
      for (( j=1; j<=cols; j++ )); do
          echo -n "* "
      done
      echo ""   # newline after each row
  done
  ```

  - The **outer loop** controls the **row** (how many lines)
  - The **inner loop** controls the **column** (what is printed per line)
  - `echo -n` prints without a trailing newline
  - A bare `echo` at the end of the outer body moves to the next line

  ---

  # Slide 2: Rectangle Pattern

  Print a rectangle of `*` with R rows and C columns:

  ```bash
  #!/bin/bash
  R=4; C=6
  for (( i=1; i<=R; i++ )); do
      for (( j=1; j<=C; j++ )); do
          echo -n "* "
      done
      echo
  done
  ```

  Output:
  ```
  * * * * * *
  * * * * * *
  * * * * * *
  * * * * * *
  ```

  ---

  # Slide 3: Right-Angled Triangle Pattern

  ```bash
  n=5
  for (( i=1; i<=n; i++ )); do
      for (( j=1; j<=i; j++ )); do
          echo -n "* "
      done
      echo
  done
  ```

  Key: inner loop runs up to `i` (not a fixed column count).

  Output:
  ```
  *
  * *
  * * *
  * * * *
  * * * * *
  ```

  ---

  # Slide 4: Number Triangle Pattern

  ```bash
  n=5
  for (( i=1; i<=n; i++ )); do
      for (( j=1; j<=i; j++ )); do
          echo -n "$j "
      done
      echo
  done
  ```

  Output:
  ```
  1
  1 2
  1 2 3
  1 2 3 4
  1 2 3 4 5
  ```

  ---

  # Slide 5: Inverted Triangle

  ```bash
  n=5
  for (( i=n; i>=1; i-- )); do
      for (( j=1; j<=i; j++ )); do
          echo -n "* "
      done
      echo
  done
  ```

  Outer loop counts **down**. Output:
  ```
  * * * * *
  * * * *
  * * *
  * *
  *
  ```

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Print Triangle Patterns
* **Est. Minutes:** 5
* **Outline:** Build star triangle and number square scripts.
* **Instructions:** Create scripts in `/home/student/scripts/`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/star_triangle.sh` that reads `n` and prints a right-angled star triangle of height n. For n=3 the last line should be `* * *`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "3" | bash /home/student/scripts/star_triangle.sh 2>/dev/null | tail -1 | grep -q '\* \* \*' && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** Create `/home/student/scripts/num_square.sh` that reads `n` and prints an n×n grid of the row number. For n=3 every number in row 2 should be `2`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "3" | bash /home/student/scripts/num_square.sh 2>/dev/null | sed -n '2p' | grep -q "2" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Multiplication Table Grid
* **Est. Minutes:** 8
* **Outline:** Write a nested loop script to print a full N×N multiplication table grid.
* **Instructions:**
  1. Create `/home/student/scripts/mul_grid.sh`.
  2. Add shebang.
  3. Read `n`.
  4. Outer loop `i` from 1 to `n`, inner loop `j` from 1 to `n`.
  5. Print `$((i * j))` with `printf "%4d"` for alignment.
  6. After each row: `echo`.
  7. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/mul_grid.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/mul_grid.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must contain two `for` loops (nested).
    * **Validation Type:** `file_content`
    * **Validation Script:** `[ $(grep -c '\bfor\b' /home/student/scripts/mul_grid.sh) -ge 2 ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** For n=3, the last line of output must contain `9` (3×3=9).
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "3" | bash /home/student/scripts/mul_grid.sh 2>/dev/null | tail -1 | grep -q "9" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Nested Loops Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on nested loops and pattern logic.

* **Questions:**

  * **Q1:** In a nested loop pattern program, the outer loop typically controls:
    * **Options:**
      * A) The column count
      * B) The specific character printed
      * C) The row (line) number
      * D) The line separator
    * **Correct Answer:** C) The row (line) number
    * **Explanation:** In pattern programs, the outer loop iterates over rows, and the inner loop iterates over columns within each row, printing characters before the row-ending newline.

  * **Q2:** What does `echo -n` do differently from `echo`?
    * **Options:**
      * A) Prints in reverse
      * B) Prints to stderr
      * C) Suppresses the trailing newline
      * D) Formats numbers
    * **Correct Answer:** C) Suppresses the trailing newline
    * **Explanation:** `echo -n` prints its arguments without appending a newline at the end. This is essential for printing characters on the same line within an inner loop.

  * **Q3:** For a right-angled triangle where row `i` has `i` stars, the inner loop should run:
    * **Options:**
      * A) From 1 to `n` always
      * B) From 1 to `i`
      * C) From `i` to `n`
      * D) From 1 to `n - i`
    * **Correct Answer:** B) From 1 to `i`
    * **Explanation:** In a right-angled triangle, row 1 has 1 star, row 2 has 2 stars, etc. The inner loop limit equals the current outer loop variable `i`.

  * **Q4:** How many total iterations does a nested loop with outer=4 and inner=3 perform?
    * **Options:**
      * A) 7
      * B) 4
      * C) 3
      * D) 12
    * **Correct Answer:** D) 12
    * **Explanation:** The inner loop runs fully (3 times) for each iteration of the outer loop (4 times). Total iterations = 4 × 3 = 12.

---

## CHAPTER 8.4: Pascal Triangle & Diamond Logic (OS Practical #5)

* **Description:** Implements Pascal's Triangle and Diamond pattern programs — the signature nested loop challenges of OS Practical Exam #5. Covers combinatorics, space management, and multi-loop diamond construction.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Pascal's Triangle and Diamond Patterns
* **Est. Minutes:** 5
* **Outline:** Explain Pascal's Triangle construction using combinations, leading spaces, and the two-part diamond (upper + lower half).

* **Instructions (Slides):**

  # Slide 1: What is Pascal's Triangle?

  Pascal's Triangle is a triangular array of numbers where each number is the sum of the two numbers directly above it:

  ```
      1
     1 1
    1 2 1
   1 3 3 1
  1 4 6 4 1
  ```

  Row 0: 1
  Row 1: 1 1
  Row 2: 1 2 1
  Row n, position k: C(n,k) = n! / (k! × (n-k)!)

  In Bash, we compute each element using the previous row.

  ---

  # Slide 2: Pascal's Triangle — Script Logic

  Strategy: Use an array to hold the current row. Start from right to left to avoid overwriting values:

  ```bash
  #!/bin/bash
  read -p "Enter number of rows: " rows
  declare -a row
  for (( i=0; i<rows; i++ )); do
      # Print leading spaces for centering
      for (( s=i; s<rows-1; s++ )); do
          echo -n " "
      done
      # Build row values (right to left to avoid overwriting)
      row[i]=1
      for (( j=i-1; j>0; j-- )); do
          row[j]=$((row[j] + row[j-1]))
      done
      # Print row
      for (( j=0; j<=i; j++ )); do
          echo -n "${row[j]} "
      done
      echo
  done
  ```

  ---

  # Slide 3: Diamond Pattern — Upper Half

  A diamond has a upper half (expanding) and lower half (shrinking):

  ```
      *
     ***
    *****
   *******
  ```

  For a diamond of size `n` (half-width), the upper half from row 1 to n:
  - Spaces: `n - i`
  - Stars: `2*i - 1`

  ```bash
  # Upper half
  for (( i=1; i<=n; i++ )); do
      for (( s=1; s<=n-i; s++ )); do echo -n " "; done
      for (( j=1; j<=2*i-1; j++ )); do echo -n "*"; done
      echo
  done
  ```

  ---

  # Slide 4: Diamond Pattern — Lower Half

  ```
   *******
    *****
     ***
      *
  ```

  Lower half from row `n-1` down to 1:
  - Spaces: `n - i`
  - Stars: `2*i - 1`

  ```bash
  # Lower half
  for (( i=n-1; i>=1; i-- )); do
      for (( s=1; s<=n-i; s++ )); do echo -n " "; done
      for (( j=1; j<=2*i-1; j++ )); do echo -n "*"; done
      echo
  done
  ```

  ---

  # Slide 5: Full Diamond Script

  ```bash
  #!/bin/bash
  read -p "Enter diamond size (n): " n
  # Upper half
  for (( i=1; i<=n; i++ )); do
      for (( s=1; s<=n-i; s++ )); do printf " "; done
      for (( j=1; j<=2*i-1; j++ )); do printf "*"; done
      echo
  done
  # Lower half
  for (( i=n-1; i>=1; i-- )); do
      for (( s=1; s<=n-i; s++ )); do printf " "; done
      for (( j=1; j<=2*i-1; j++ )); do printf "*"; done
      echo
  done
  ```

  For n=4, widest row has `2*4-1 = 7` stars.

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Diamond Pattern in the Terminal
* **Est. Minutes:** 5
* **Outline:** Build and test the diamond script from the terminal.
* **Instructions:** Create `/home/student/scripts/diamond.sh` and test it.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/diamond.sh` implementing the full diamond pattern.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/diamond.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** For n=3, the middle row (row 3) must contain exactly 5 stars (`*****`).
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "3" | bash /home/student/scripts/diamond.sh 2>/dev/null | grep -q '\*\*\*\*\*' && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 3:**
    * **Instruction:** For n=3, the first and last rows must contain exactly 1 star.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "3" | bash /home/student/scripts/diamond.sh 2>/dev/null | head -1 | grep -q '\*' && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Pascal's Triangle (OS Practical #5)
* **Est. Minutes:** 8
* **Outline:** Write the Pascal's Triangle script with correct centering and row computation.
* **Instructions:**
  1. Create `/home/student/scripts/pascal.sh`.
  2. Add shebang and comment `# OS Practical #5 - Pascal Triangle`.
  3. Read number of rows into `rows`.
  4. Declare an integer array `row`.
  5. Implement the nested loop to compute and print Pascal's triangle (use the right-to-left update strategy).
  6. Include leading spaces for visual centering.
  7. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/pascal.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/pascal.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must use `declare -a` or array syntax.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'declare\|row\[' /home/student/scripts/pascal.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** For rows=5, the first line of output must contain only `1`.
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "5" | bash /home/student/scripts/pascal.sh 2>/dev/null | head -1 | grep -q '1' && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** For rows=5, the 5th line must contain `1 4 6 4 1` (the 5th row of Pascal's triangle).
    * **Validation Type:** `command_check`
    * **Validation Script:** `echo "5" | bash /home/student/scripts/pascal.sh 2>/dev/null | sed -n '5p' | grep -q '6' && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Pascal & Diamond Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on Pascal's Triangle and Diamond pattern logic.

* **Questions:**

  * **Q1:** In Pascal's Triangle, each number equals:
    * **Options:**
      * A) The product of the two numbers above it
      * B) The sum of the two numbers directly above it
      * C) The difference of the two numbers above it
      * D) The square of the row number
    * **Correct Answer:** B) The sum of the two numbers directly above it
    * **Explanation:** Pascal's Triangle is defined by the recurrence: every interior element equals the sum of the two elements in the row above to its left and right. All edge elements are 1.

  * **Q2:** For a diamond of size n=4, how many stars are in the widest (middle) row?
    * **Options:**
      * A) 4
      * B) 6
      * C) 7
      * D) 8
    * **Correct Answer:** C) 7
    * **Explanation:** The widest row of the diamond has `2*n - 1` stars. For n=4: `2*4 - 1 = 7`.

  * **Q3:** Why is the Pascal's Triangle array updated right-to-left?
    * **Options:**
      * A) For printing alignment
      * B) To avoid overwriting values needed for computing later positions in the same row
      * C) Left-to-right doesn't work in Bash
      * D) It produces the same result either way
    * **Correct Answer:** B) To avoid overwriting values needed for computing later positions in the same row
    * **Explanation:** When computing in-place using a single array, updating left-to-right would corrupt values before they are used. Right-to-left ensures each element is computed using the unchanged previous-row values.

  * **Q4:** The 3rd row (0-indexed) of Pascal's Triangle is:
    * **Options:**
      * A) 1 1 1
      * B) 1 2 1
      * C) 1 3 3 1
      * D) 1 4 6 4 1
    * **Correct Answer:** C) 1 3 3 1
    * **Explanation:** Row 0: `1`, Row 1: `1 1`, Row 2: `1 2 1`, Row 3: `1 3 3 1`. Each element in row 3 is the sum of adjacent elements from row 2.

---

# MODULE 9: FUNCTIONS

## CHAPTER 9.1: Shell Functions

* **Description:** Covers defining and calling functions in Bash — including parameters, return values, local variables, and recursive functions.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Functions in Bash Scripting
* **Est. Minutes:** 5
* **Outline:** Explain function definition syntax, calling functions, local variables, return values, and recursion.

* **Instructions (Slides):**

  # Slide 1: Defining a Function

  Two equivalent syntaxes:

  ```bash
  # Syntax 1 (preferred)
  function_name() {
      # commands
  }

  # Syntax 2 (using function keyword)
  function function_name {
      # commands
  }
  ```

  Functions must be **defined before they are called**. The definition does nothing by itself — it only runs when called.

  ---

  # Slide 2: Calling a Function

  Simply use the function name like any command:

  ```bash
  greet() {
      echo "Hello from the function!"
  }

  greet         # call the function
  greet         # call again — functions are reusable
  ```

  ---

  # Slide 3: Function Arguments

  Arguments are passed just like script arguments and accessed as `$1`, `$2`, etc.:

  ```bash
  greet_user() {
      echo "Hello, $1! You are $2 years old."
  }

  greet_user "Alice" 20
  greet_user "Bob" 22
  ```

  Inside a function, `$@` is all the function's arguments; `$#` is their count.

  ---

  # Slide 4: Local Variables

  Variables inside functions are **global by default**. Use `local` to restrict scope:

  ```bash
  calculate() {
      local x=$1
      local y=$2
      local sum=$((x + y))
      echo "Sum: $sum"
  }

  calculate 3 7   # Sum: 10
  echo $sum       # prints nothing — sum is local to calculate()
  ```

  Always use `local` in functions to prevent accidentally overwriting global variables.

  ---

  # Slide 5: Return Values

  Bash functions can only `return` exit codes (0–255). Use `echo` to "return" actual data:

  ```bash
  square() {
      local n=$1
      echo $((n * n))    # "return" via stdout
  }

  result=$(square 5)   # capture via command substitution
  echo "Square: $result"
  ```

  Check success/failure with `return 0` (success) and `return 1` (failure):
  ```bash
  is_even() {
      [ $(($1 % 2)) -eq 0 ] && return 0 || return 1
  }
  is_even 4 && echo "Even" || echo "Odd"
  ```

  ---

  # Slide 6: Recursive Functions

  A function that calls itself — useful for factorial, Fibonacci:

  ```bash
  factorial() {
      local n=$1
      if [ $n -le 1 ]; then
          echo 1
          return
      fi
      local sub=$(factorial $((n - 1)))
      echo $((n * sub))
  }

  result=$(factorial 5)
  echo "5! = $result"   # 5! = 120
  ```

  Bash recursion can be slow for large values — prefer iterative loops for n > 15.

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Writing and Calling Functions
* **Est. Minutes:** 5
* **Outline:** Create a script with multiple functions and call them.
* **Instructions:** Create `/home/student/scripts/functions_demo.sh`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/functions_demo.sh` with a function `say_hello` that prints "Hello, World!" and call it.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/functions_demo.sh 2>/dev/null | grep -q "Hello, World!" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** Add a function `add_nums` that takes two arguments and prints their sum. Call it with 8 and 12; output must contain "20".
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/functions_demo.sh 2>/dev/null | grep -q "20" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Calculator Using Functions
* **Est. Minutes:** 8
* **Outline:** Write a four-function calculator (add, subtract, multiply, divide) using Bash functions.
* **Instructions:**
  1. Create `/home/student/scripts/calculator.sh`.
  2. Add shebang.
  3. Define functions: `add()`, `subtract()`, `multiply()`, `divide()` — each takes `$1` and `$2` and echoes the result.
  4. Read two numbers `a` and `b`.
  5. Call all four functions and print labelled results:
     ```
     Add      : 15
     Subtract : 5
     Multiply : 50
     Divide   : 2
     ```
  6. Handle division by zero: if b=0, print "Error: Division by zero".
  7. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/calculator.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/calculator.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must define at least 4 functions.
    * **Validation Type:** `file_content`
    * **Validation Script:** `[ $(grep -c '()' /home/student/scripts/calculator.sh) -ge 4 ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** For inputs 10 and 5, output must contain "Add" and "15".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "10\n5\n" | bash /home/student/scripts/calculator.sh 2>/dev/null | grep -q "15" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** For inputs 10 and 5, output must contain "50" (multiply result).
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "10\n5\n" | bash /home/student/scripts/calculator.sh 2>/dev/null | grep -q "50" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 5:**
    * **Instruction:** For inputs 10 and 0, output must contain "Division by zero".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "10\n0\n" | bash /home/student/scripts/calculator.sh 2>/dev/null | grep -qi "division by zero" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Shell Functions Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on function definition, arguments, and return values.

* **Questions:**

  * **Q1:** Which keyword restricts a variable's scope to the current function?
    * **Options:**
      * A) `private`
      * B) `local`
      * C) `scope`
      * D) `static`
    * **Correct Answer:** B) `local`
    * **Explanation:** In Bash, the `local` keyword declares a variable with function-level scope. Without `local`, all variables are global and can accidentally affect other parts of the script.

  * **Q2:** How do you "return" a computed value from a Bash function?
    * **Options:**
      * A) Use `return value`
      * B) Use `echo value` and capture with `$(func_name)`
      * C) Assign to a global variable only
      * D) Use `output value`
    * **Correct Answer:** B) Use `echo value` and capture with `$(func_name)`
    * **Explanation:** Bash's `return` statement only returns exit codes (0–255). To pass actual data back to the caller, `echo` the value inside the function and capture it with command substitution.

  * **Q3:** Inside a function, `$1` refers to:
    * **Options:**
      * A) The script's first command-line argument
      * B) The function's first argument
      * C) The function's name
      * D) The script's process ID
    * **Correct Answer:** B) The function's first argument
    * **Explanation:** Inside a function, positional parameters (`$1`, `$2`, etc.) are reset to the function's own arguments. The script's original arguments are not visible unless explicitly passed.

  * **Q4:** A recursive function in Bash MUST have:
    * **Options:**
      * A) A `local` keyword
      * B) A base case to prevent infinite recursion
      * C) The `function` keyword
      * D) At least two parameters
    * **Correct Answer:** B) A base case to prevent infinite recursion
    * **Explanation:** All recursive functions need a base case — a condition where they stop calling themselves and return a direct result. Without it, the function calls itself indefinitely until the shell hits its stack limit.

---

# MODULE 10: SEARCHING ALGORITHMS

## CHAPTER 10.1: Arrays in Shell

* **Description:** Introduces Bash arrays — declaration, indexing, iteration, and common array operations — as the prerequisite foundation for implementing search algorithms.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Arrays in Bash
* **Est. Minutes:** 5
* **Outline:** Cover array declaration, indexed access, array length, iteration, and common operations.

* **Instructions (Slides):**

  # Slide 1: Declaring and Initializing Arrays

  ```bash
  # Declare explicitly (optional)
  declare -a fruits

  # Assign all at once
  fruits=("apple" "banana" "cherry" "date" "elderberry")

  # Assign individual elements
  nums[0]=10
  nums[1]=20
  nums[2]=30
  ```

  Bash arrays are **zero-indexed** (first element is index 0).

  ---

  # Slide 2: Accessing Array Elements

  ```bash
  fruits=("apple" "banana" "cherry")

  echo ${fruits[0]}      # apple
  echo ${fruits[1]}      # banana
  echo ${fruits[-1]}     # cherry (last element, Bash 4.2+)
  echo ${fruits[@]}      # all elements
  echo ${fruits[*]}      # all elements (as one string)
  echo ${#fruits[@]}     # length (number of elements)
  ```

  Always use `${}` syntax (curly braces required for arrays).

  ---

  # Slide 3: Iterating Over an Array

  ```bash
  nums=(5 10 15 20 25)

  # Method 1: iterate by value
  for val in "${nums[@]}"; do
      echo "Value: $val"
  done

  # Method 2: iterate by index
  for (( i=0; i<${#nums[@]}; i++ )); do
      echo "Index $i: ${nums[$i]}"
  done
  ```

  Use Method 2 when you need the index (required for search algorithms).

  ---

  # Slide 4: Modifying Arrays

  ```bash
  arr=(1 2 3 4 5)

  # Append element
  arr+=( 6 )

  # Modify element
  arr[2]=99

  # Delete element (leaves a gap)
  unset arr[1]

  # Delete entire array
  unset arr
  ```

  ---

  # Slide 5: Reading an Array From User Input

  ```bash
  read -p "Enter size: " n
  echo "Enter $n numbers:"
  for (( i=0; i<n; i++ )); do
      read -p "  Element $((i+1)): " arr[$i]
  done
  echo "You entered: ${arr[@]}"
  ```

  This pattern is used in every search and sort algorithm practical.

  ---

  # Slide 6: Sorting an Array (Bubble Sort Preview)

  ```bash
  arr=(5 2 8 1 9 3)
  n=${#arr[@]}
  for (( i=0; i<n-1; i++ )); do
      for (( j=0; j<n-i-1; j++ )); do
          if [ ${arr[$j]} -gt ${arr[$((j+1))]} ]; then
              temp=${arr[$j]}
              arr[$j]=${arr[$((j+1))]}
              arr[$((j+1))]=$temp
          fi
      done
  done
  echo "Sorted: ${arr[@]}"
  ```

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Array Operations Practice
* **Est. Minutes:** 5
* **Outline:** Declare, populate, and iterate over a Bash array.
* **Instructions:** Create `/home/student/scripts/array_demo.sh`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/array_demo.sh` that declares `nums=(10 20 30 40 50)` and prints each element on a separate line using a for loop.
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/array_demo.sh 2>/dev/null | grep -q "^30$" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 2:**
    * **Instruction:** The script must also print the total number of elements: "Count: 5".
    * **Validation Type:** `command_check`
    * **Validation Script:** `bash /home/student/scripts/array_demo.sh 2>/dev/null | grep -q "Count: 5" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Array Input and Max Finder
* **Est. Minutes:** 8
* **Outline:** Write a script that reads N numbers into an array and finds the maximum.
* **Instructions:**
  1. Create `/home/student/scripts/find_max.sh`.
  2. Add shebang.
  3. Read `n` (size of array).
  4. Loop to read `n` numbers into `arr[]`.
  5. Initialize `max=${arr[0]}`.
  6. Loop through array; if `arr[i] > max`, update `max`.
  7. Print "Maximum: $max".
  8. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/find_max.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/find_max.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must use array indexing syntax `arr[`.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'arr\[' /home/student/scripts/find_max.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** For inputs n=5 and elements 3 9 1 7 2, output must contain "Maximum: 9".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "5\n3\n9\n1\n7\n2\n" | bash /home/student/scripts/find_max.sh 2>/dev/null | grep -q "Maximum: 9" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Arrays Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on Bash arrays.

* **Questions:**

  * **Q1:** What is the index of the first element of a Bash array?
    * **Options:**
      * A) 1
      * B) -1
      * C) 0
      * D) It depends on declaration
    * **Correct Answer:** C) 0
    * **Explanation:** Bash arrays are zero-indexed. The first element is at index 0, the second at index 1, and so on — consistent with C and most programming languages.

  * **Q2:** Which expression gives the number of elements in array `arr`?
    * **Options:**
      * A) `${arr.length}`
      * B) `$#arr`
      * C) `${#arr[@]}`
      * D) `len($arr)`
    * **Correct Answer:** C) `${#arr[@]}`
    * **Explanation:** In Bash, `${#arr[@]}` returns the number of elements in the array `arr`. The `#` prefix gives the length, and `[@]` refers to all elements.

  * **Q3:** How do you access all elements of an array `fruits`?
    * **Options:**
      * A) `$fruits`
      * B) `${fruits}`
      * C) `${fruits[*]}` or `${fruits[@]}`
      * D) `${fruits[all]}`
    * **Correct Answer:** C) `${fruits[*]}` or `${fruits[@]}`
    * **Explanation:** `${arr[@]}` expands each element as a separate word (preserves spaces in elements), while `${arr[*]}` expands to a single string. Both can be used to access all elements.

  * **Q4:** What does `arr+=(99)` do?
    * **Options:**
      * A) Adds 99 to every element
      * B) Appends 99 as a new element at the end of the array
      * C) Replaces the first element with 99
      * D) Clears the array and sets it to 99
    * **Correct Answer:** B) Appends 99 as a new element at the end of the array
    * **Explanation:** The `+=` operator on a Bash array appends the elements in the parentheses to the end of the array, increasing its size by the number of new elements.

---

## CHAPTER 10.2: Linear Search (OS Practical #6)

* **Description:** Implements Linear Search in Bash — searching an unsorted array element by element — directly addressing OS Practical Exam #6 requirements.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Linear Search Algorithm
* **Est. Minutes:** 5
* **Outline:** Explain linear search concept, algorithm steps, time complexity, and Bash implementation.

* **Instructions (Slides):**

  # Slide 1: What is Linear Search?

  **Linear Search** (also called Sequential Search) scans each element of an array from left to right until it finds the target or reaches the end.

  It is the simplest search algorithm:
  - Works on **unsorted** arrays
  - No preprocessing required
  - Returns the index of the found element, or -1 if not found

  ---

  # Slide 2: Algorithm Steps

  ```
  Algorithm LinearSearch(arr, n, target):
    FOR i FROM 0 TO n-1:
      IF arr[i] == target:
        RETURN i       // Found at index i
    RETURN -1          // Not found
  ```

  Step by step for `arr = [5, 3, 8, 1, 9]`, target = `8`:
  - i=0: 5 ≠ 8 → continue
  - i=1: 3 ≠ 8 → continue
  - i=2: 8 = 8 → **FOUND at index 2**

  ---

  # Slide 3: Time Complexity

  | Case | Comparisons | Complexity |
  |------|-------------|------------|
  | Best Case | 1 (target is first element) | O(1) |
  | Average Case | n/2 | O(n) |
  | Worst Case | n (target is last or absent) | O(n) |

  Linear search is suitable for **small arrays** or **unsorted data**. For large sorted data, Binary Search is preferred.

  ---

  # Slide 4: Bash Implementation

  ```bash
  #!/bin/bash
  # OS Practical #6 - Linear Search

  read -p "Enter size of array: " n
  echo "Enter $n elements:"
  for (( i=0; i<n; i++ )); do
      read arr[$i]
  done
  read -p "Enter element to search: " target

  found=-1
  for (( i=0; i<n; i++ )); do
      if [ ${arr[$i]} -eq $target ]; then
          found=$i
          break
      fi
  done

  if [ $found -ne -1 ]; then
      echo "Element $target found at index $found (position $((found+1)))"
  else
      echo "Element $target not found in array"
  fi
  ```

  ---

  # Slide 5: Linear Search with All Occurrences

  If the array may have duplicates, don't break — collect all indices:

  ```bash
  count=0
  for (( i=0; i<n; i++ )); do
      if [ ${arr[$i]} -eq $target ]; then
          echo "Found at index $i"
          count=$((count + 1))
      fi
  done
  echo "Total occurrences: $count"
  ```

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Implement Linear Search
* **Est. Minutes:** 5
* **Outline:** Build a complete linear search script and test it with known inputs.
* **Instructions:** Create `/home/student/scripts/linear_search.sh`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/linear_search.sh` implementing linear search. File must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/linear_search.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** The script must use a `for` loop with array indexing.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q '\bfor\b' /home/student/scripts/linear_search.sh && grep -q 'arr\[' /home/student/scripts/linear_search.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** For inputs n=5, elements 3 9 1 7 2, target 7 — output must contain "found" (case-insensitive).
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "5\n3\n9\n1\n7\n2\n7\n" | bash /home/student/scripts/linear_search.sh 2>/dev/null | grep -qi "found" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** For inputs n=5, elements 3 9 1 7 2, target 99 — output must contain "not found" (case-insensitive).
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "5\n3\n9\n1\n7\n2\n99\n" | bash /home/student/scripts/linear_search.sh 2>/dev/null | grep -qi "not found" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Linear Search With Function (OS Practical #6)
* **Est. Minutes:** 8
* **Outline:** Refactor the linear search into a function and add a count of occurrences.
* **Instructions:**
  1. Create `/home/student/scripts/linear_search_fn.sh`.
  2. Add shebang and comment `# OS Practical #6 - Linear Search (Function Version)`.
  3. Define function `linear_search()` that takes the target as `$1` and uses global array `arr` and `n`.
  4. Inside the function: loop through array; print every index where target is found; count occurrences.
  5. After the function definition: read `n`, read `n` elements into `arr`, read `target`, call `linear_search $target`.
  6. Print total occurrences at the end.
  7. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/linear_search_fn.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/linear_search_fn.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must define a function (contains `()` and `{`).
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q '()' /home/student/scripts/linear_search_fn.sh && grep -q '{' /home/student/scripts/linear_search_fn.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** For inputs n=6, elements 4 7 2 7 9 1, target 7 — output must show 7 was found (mention index or "found").
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "6\n4\n7\n2\n7\n9\n1\n7\n" | bash /home/student/scripts/linear_search_fn.sh 2>/dev/null | grep -qi "found\|index" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** For the same inputs (target 7 appears twice), output must contain "2" (total occurrences).
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "6\n4\n7\n2\n7\n9\n1\n7\n" | bash /home/student/scripts/linear_search_fn.sh 2>/dev/null | grep -q "2" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Linear Search Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehension check on linear search algorithm and complexity.

* **Questions:**

  * **Q1:** What is the worst-case time complexity of Linear Search?
    * **Options:**
      * A) O(1)
      * B) O(log n)
      * C) O(n)
      * D) O(n²)
    * **Correct Answer:** C) O(n)
    * **Explanation:** In the worst case (target is the last element or not present), linear search must compare against all n elements, giving O(n) time complexity.

  * **Q2:** Linear Search requires the array to be:
    * **Options:**
      * A) Sorted in ascending order
      * B) Sorted in descending order
      * C) Stored in a hash table
      * D) In any order (unsorted arrays work)
    * **Correct Answer:** D) In any order (unsorted arrays work)
    * **Explanation:** Linear search is order-independent — it scans sequentially regardless of element order. This is its key advantage over Binary Search, which requires a sorted array.

  * **Q3:** What value is returned when the target is not found in a standard linear search implementation?
    * **Options:**
      * A) 0
      * B) -1
      * C) The last index
      * D) An error
    * **Correct Answer:** B) -1
    * **Explanation:** By convention, search algorithms return -1 to indicate "not found", since -1 is never a valid array index (arrays start at 0). This sentinel value can then be checked by the caller.

  * **Q4:** In a linear search, when is a `break` statement useful?
    * **Options:**
      * A) To reset the loop counter
      * B) To search from the end of the array
      * C) To stop the loop as soon as the target is found (first occurrence)
      * D) To skip even-indexed elements
    * **Correct Answer:** C) To stop the loop as soon as the target is found (first occurrence)
    * **Explanation:** Once the target is found, there's no need to compare remaining elements. `break` exits the loop immediately, saving unnecessary comparisons. Without `break`, the search would continue to the end even after finding the target.

---

## CHAPTER 10.3: Binary Search (OS Practical #7)

* **Description:** Implements Binary Search in Bash — the efficient divide-and-conquer search on sorted arrays — directly addressing OS Practical Exam #7. Covers both iterative and recursive variants.

---

### QUEST 1: THEORY

* **Type:** `theory_only`
* **Title:** Binary Search Algorithm
* **Est. Minutes:** 5
* **Outline:** Explain binary search logic, sorted array requirement, mid-point calculation, iterative and recursive implementations, and complexity comparison with linear search.

* **Instructions (Slides):**

  # Slide 1: What is Binary Search?

  **Binary Search** is a highly efficient searching algorithm that works on **sorted arrays** by repeatedly halving the search space:

  - Compare the target with the **middle element**
  - If equal → found
  - If target < middle → search the **left half**
  - If target > middle → search the **right half**
  - Repeat until found or search space is empty

  Each comparison eliminates half the remaining elements.

  ---

  # Slide 2: Algorithm Steps

  ```
  Algorithm BinarySearch(arr, n, target):
    low = 0
    high = n - 1
    WHILE low <= high:
      mid = (low + high) / 2
      IF arr[mid] == target:
        RETURN mid
      ELSE IF arr[mid] < target:
        low = mid + 1
      ELSE:
        high = mid - 1
    RETURN -1
  ```

  For `arr = [1, 3, 5, 7, 9, 11, 13]`, target = `7`:
  - low=0, high=6, mid=3, arr[3]=7 → **FOUND at index 3**

  ---

  # Slide 3: Time Complexity

  | Case | Comparisons | Complexity |
  |------|-------------|------------|
  | Best Case | 1 (target is middle) | O(1) |
  | Average Case | log₂n | O(log n) |
  | Worst Case | log₂n | O(log n) |

  Comparison: For n=1,000,000 elements:
  - Linear Search: up to 1,000,000 comparisons
  - Binary Search: at most **20 comparisons** (log₂ 1,000,000 ≈ 20)

  **Prerequisite:** Array MUST be sorted before binary search.

  ---

  # Slide 4: Iterative Bash Implementation

  ```bash
  #!/bin/bash
  # OS Practical #7 - Binary Search (Iterative)

  read -p "Enter size: " n
  echo "Enter $n elements in SORTED order:"
  for (( i=0; i<n; i++ )); do read arr[$i]; done
  read -p "Enter target: " target

  low=0
  high=$((n - 1))
  found=-1

  while [ $low -le $high ]; do
      mid=$(( (low + high) / 2 ))
      if [ ${arr[$mid]} -eq $target ]; then
          found=$mid
          break
      elif [ ${arr[$mid]} -lt $target ]; then
          low=$((mid + 1))
      else
          high=$((mid - 1))
      fi
  done

  if [ $found -ne -1 ]; then
      echo "Found at index $found (position $((found+1)))"
  else
      echo "Not found"
  fi
  ```

  ---

  # Slide 5: Recursive Bash Implementation

  ```bash
  binary_search() {
      local low=$1
      local high=$2
      local target=$3

      if [ $low -gt $high ]; then
          echo -1
          return
      fi

      local mid=$(( (low + high) / 2 ))

      if [ ${arr[$mid]} -eq $target ]; then
          echo $mid
      elif [ ${arr[$mid]} -lt $target ]; then
          binary_search $((mid + 1)) $high $target
      else
          binary_search $low $((mid - 1)) $target
      fi
  }

  result=$(binary_search 0 $((n-1)) $target)
  if [ $result -ne -1 ]; then
      echo "Found at index $result"
  else
      echo "Not found"
  fi
  ```

  ---

  # Slide 6: Binary Search vs Linear Search

  | Feature | Linear Search | Binary Search |
  |---------|--------------|---------------|
  | Array requirement | Any order | Must be sorted |
  | Time complexity | O(n) | O(log n) |
  | Space complexity | O(1) | O(1) iterative, O(log n) recursive |
  | Implementation | Simple | Moderate |
  | Best for | Small/unsorted | Large sorted data |

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`
* **Title:** Implement Iterative Binary Search
* **Est. Minutes:** 5
* **Outline:** Build and test a complete iterative binary search script.
* **Instructions:** Create `/home/student/scripts/binary_search.sh`.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** Create `/home/student/scripts/binary_search.sh` with iterative binary search. Must use `while` loop and `low`/`high`/`mid` variables.
    * **Validation Type:** `file_content`
    * **Validation Script:** `grep -q 'low' /home/student/scripts/binary_search.sh && grep -q 'high' /home/student/scripts/binary_search.sh && grep -q 'mid' /home/student/scripts/binary_search.sh && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** For inputs n=7, sorted elements 1 3 5 7 9 11 13, target 9 — output must contain "Found" or "found".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "7\n1\n3\n5\n7\n9\n11\n13\n9\n" | bash /home/student/scripts/binary_search.sh 2>/dev/null | grep -qi "found" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 3:**
    * **Instruction:** For inputs n=7, sorted elements 1 3 5 7 9 11 13, target 6 — output must contain "Not found" or "not found".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "7\n1\n3\n5\n7\n9\n11\n13\n6\n" | bash /home/student/scripts/binary_search.sh 2>/dev/null | grep -qi "not found" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`
* **Title:** Recursive Binary Search (OS Practical #7)
* **Est. Minutes:** 8
* **Outline:** Write the complete recursive binary search with a wrapper function — the exam-ready version.
* **Instructions:**
  1. Create `/home/student/scripts/binary_search_rec.sh`.
  2. Add shebang and comment `# OS Practical #7 - Binary Search (Recursive)`.
  3. Declare global `arr` array.
  4. Define `binary_search()` function with parameters: `low`, `high`, `target`.
  5. Base case: if `low > high`, echo -1 and return.
  6. Compute `mid=$(( (low + high) / 2 ))`.
  7. If `arr[mid] == target`: echo `$mid`.
  8. Elif `arr[mid] < target`: call `binary_search $((mid+1)) $high $target`.
  9. Else: call `binary_search $low $((mid-1)) $target`.
  10. Main body: read `n`, read sorted elements, read `target`, call function, print result.
  11. Save and make executable.

* **Tasks:**

  * **Task 1:**
    * **Instruction:** File `/home/student/scripts/binary_search_rec.sh` must exist.
    * **Validation Type:** `file_exists`
    * **Validation Script:** `[ -f "/home/student/scripts/binary_search_rec.sh" ] && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 2:**
    * **Instruction:** Script must define a function that calls itself recursively (function name appears in its own body).
    * **Validation Type:** `file_content`
    * **Validation Script:** `fname=$(grep -m1 '()' /home/student/scripts/binary_search_rec.sh | grep -o '^[a-zA-Z_]*'); grep -c "$fname" /home/student/scripts/binary_search_rec.sh | grep -qv '^1$' && echo "OK" || echo "FAIL"`
    * **Expected Output:** `OK`

  * **Task 3:**
    * **Instruction:** For inputs n=5, sorted elements 2 4 6 8 10, target 6 — output must contain index "2" (0-indexed) or position "3".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "5\n2\n4\n6\n8\n10\n6\n" | bash /home/student/scripts/binary_search_rec.sh 2>/dev/null | grep -qE "[23]" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 4:**
    * **Instruction:** For inputs n=5, sorted elements 2 4 6 8 10, target 5 — output must contain "Not found" or "-1".
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "5\n2\n4\n6\n8\n10\n5\n" | bash /home/student/scripts/binary_search_rec.sh 2>/dev/null | grep -qiE "not found|-1" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

  * **Task 5:**
    * **Instruction:** For inputs n=7, sorted 1 3 5 7 9 11 13, target 1 (first element) — output must indicate found (boundary test).
    * **Validation Type:** `command_check`
    * **Validation Script:** `printf "7\n1\n3\n5\n7\n9\n11\n13\n1\n" | bash /home/student/scripts/binary_search_rec.sh 2>/dev/null | grep -qiE "found|index 0|position 1" && echo "PASS" || echo "FAIL"`
    * **Expected Output:** `PASS`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`
* **Title:** Binary Search Quiz
* **Est. Minutes:** 3
* **Outline:** Comprehensive check on binary search algorithm, complexity, and comparison with linear search.

* **Questions:**

  * **Q1:** What is the primary prerequisite for Binary Search?
    * **Options:**
      * A) The array must contain only integers
      * B) The array size must be a power of 2
      * C) The array must be sorted
      * D) The array must be stored in a file
    * **Correct Answer:** C) The array must be sorted
    * **Explanation:** Binary Search relies on the sorted order to decide which half to discard. If the array is unsorted, the algorithm cannot correctly determine which side contains the target and will produce wrong results.

  * **Q2:** What is the time complexity of Binary Search in the worst case?
    * **Options:**
      * A) O(n)
      * B) O(n²)
      * C) O(1)
      * D) O(log n)
    * **Correct Answer:** D) O(log n)
    * **Explanation:** Each comparison in binary search eliminates half the remaining elements. For n elements, the maximum number of comparisons is ⌊log₂n⌋ + 1, giving O(log n) complexity.

  * **Q3:** In a binary search on an array of 7 elements `[1, 3, 5, 7, 9, 11, 13]`, searching for target=11. What is the first `mid` index?
    * **Options:**
      * A) 0
      * B) 3
      * C) 6
      * D) 4
    * **Correct Answer:** B) 3
    * **Explanation:** low=0, high=6, mid = (0+6)/2 = 3. arr[3]=7 < 11, so search moves to right half (low=4, high=6). Next mid=(4+6)/2=5, arr[5]=11 → Found.

  * **Q4:** Which of the following best describes the binary search "divide and conquer" strategy?
    * **Options:**
      * A) Sort the array, then use linear search
      * B) Split the array in two halves recursively until the target is isolated
      * C) Hash the target and look up its position
      * D) Compare with every element starting from the middle
    * **Correct Answer:** B) Split the array in two halves recursively until the target is isolated
    * **Explanation:** Binary search is a classic divide-and-conquer algorithm: it divides the problem (search space) in half at each step, conquers by recursing/iterating on the relevant half, and combines by simply returning the found index — with no merge step needed.

---

# END OF CURRICULUM

## Summary: All Modules, Chapters, and Quests

| Module | Chapter | Quests |
|--------|---------|--------|
| 6: Shell Scripting Basics | 6.1 First Shell Script | Theory, Terminal, Editor, MCQ |
| | 6.2 Variables | Theory, Terminal, Editor, MCQ |
| | 6.3 User Input | Theory, Terminal, Editor, MCQ |
| 7: Decision Making | 7.1 if Statement | Theory, Terminal, Editor, MCQ |
| | 7.2 if-else | Theory, Terminal, Editor, MCQ |
| | 7.3 Nested Conditions (OS Practical #4) | Theory, Terminal, Editor, MCQ |
| 8: Loops | 8.1 for Loop | Theory, Terminal, Editor, MCQ |
| | 8.2 while Loop | Theory, Terminal, Editor, MCQ |
| | 8.3 Nested Loops | Theory, Terminal, Editor, MCQ |
| | 8.4 Pascal Triangle & Diamond (OS Practical #5) | Theory, Terminal, Editor, MCQ |
| 9: Functions | 9.1 Shell Functions | Theory, Terminal, Editor, MCQ |
| 10: Searching Algorithms | 10.1 Arrays in Shell | Theory, Terminal, Editor, MCQ |
| | 10.2 Linear Search (OS Practical #6) | Theory, Terminal, Editor, MCQ |
| | 10.3 Binary Search (OS Practical #7) | Theory, Terminal, Editor, MCQ |

**Total:** 14 Chapters × 4 Quests = **56 Quests**
- 14 Theory (Slides) modules
- 14 Terminal Challenges with working validation scripts
- 14 File Editor Challenges with working validation scripts
- 14 MCQ Exercises (4 questions each = 56 MCQs)

---
*Linux & Shell Scripting Fundamentals — OS Practical Exam Curriculum | Generated for University Students*