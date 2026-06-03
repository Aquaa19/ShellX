````markdown
# MODULE 1: INTRODUCTION TO LINUX & TERMINAL

## CHAPTER: 1.1 What is Linux?
* **Description:** Introduction to Linux, operating systems, distributions, and why Linux is widely used in servers, development, and education.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Understanding Linux Fundamentals
* **Est. Minutes:** 5
* **Outline:** Learn what Linux is and where it is used.

* **Instructions (Slides):**

# Slide 1: What is an Operating System?

An Operating System (OS) is system software that acts as an interface between users and computer hardware.

Main responsibilities:

- Managing files
- Managing memory
- Running applications
- Handling input/output devices
- Providing security

Examples:

- Linux
- Windows
- macOS
- Android

---

# Slide 2: What is Linux?

Linux is an open-source operating system kernel created by
Linus Torvalds in 1991.

Characteristics:

- Free and open source
- Multi-user
- Multitasking
- Secure
- Stable
- Highly customizable

Linux powers:

- Servers
- Cloud systems
- Supercomputers
- Android devices
- Embedded systems

---

# Slide 3: Linux Distributions

A Linux Distribution (Distro) combines:

- Linux Kernel
- System Utilities
- Package Manager
- Desktop Environment

Popular Distributions:

- Ubuntu
- Debian
- Fedora
- Arch Linux
- Linux Mint

---

# Slide 4: Advantages of Linux

Benefits include:

- High stability
- Better security
- Free to use
- Powerful command line
- Excellent for programming
- Used in industry and research

---

# Slide 5: Why Learn Linux?

Linux is important because:

- Most servers run Linux
- DevOps tools run on Linux
- Cloud computing depends heavily on Linux
- Operating System practical exams often use Linux commands

---

### QUEST 2: TERMINAL CHALLENGE
* **Type:** `terminal_challenge`
* **Title:** Explore Your Linux System
* **Est. Minutes:** 5
* **Outline:** Practice basic Linux discovery commands.

* **Instructions:**

Open Terminal and execute the commands:

1. Display current user.
2. Display Linux kernel information.
3. Display current working directory.

* **Tasks:**

* **Task 1:**
  * **Instruction:** Create directory `/home/student/linux_intro`
  * **Validation Type:** `file_exists`
  * **Validation Script:** `[ -d "/home/student/linux_intro" ] && echo "OK" || echo "FAIL"`
  * **Expected Output:** `OK`

* **Task 2:**
  * **Instruction:** Create subdirectory `/home/student/linux_intro/practice`
  * **Validation Type:** `file_exists`
  * **Validation Script:** `[ -d "/home/student/linux_intro/practice" ] && echo "OK" || echo "FAIL"`
  * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE
* **Type:** `editor_challenge`
* **Title:** Create Linux Notes
* **Est. Minutes:** 8
* **Outline:** Create and edit a Linux notes file.

* **Instructions:**

1. Open a text editor.
2. Create file:
   `/home/student/linux_intro/linux_notes.txt`
3. Write:
   `Linux is an open source operating system.`

* **Tasks:**

* **Task 1:**
  * **Instruction:** Create the notes file.
  * **Validation Type:** `file_exists`
  * **Validation Script:** `[ -f "/home/student/linux_intro/linux_notes.txt" ] && echo "OK" || echo "FAIL"`
  * **Expected Output:** `OK`

* **Task 2:**
  * **Instruction:** Add Linux description.
  * **Validation Type:** `file_content`
  * **Validation Script:** `grep -qi "open source operating system" /home/student/linux_intro/linux_notes.txt && echo "MATCH" || echo "NO_MATCH"`
  * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)
* **Type:** `exercise`
* **Title:** Linux Basics Quiz
* **Est. Minutes:** 3
* **Outline:** Chapter comprehension check

* **Questions:**

* **Q1:** Linux is primarily a:
  * **Options:**
    * A) Compiler
    * B) Database
    * C) Operating System
    * D) Browser
  * **Correct Answer:** C) Operating System
  * **Explanation:** Linux is an operating system.

* **Q2:** Linux was created by:
  * **Options:**
    * A) Bill Gates
    * B) Linus Torvalds
    * C) Steve Jobs
    * D) Dennis Ritchie
  * **Correct Answer:** B) Linus Torvalds
  * **Explanation:** Linus Torvalds created Linux in 1991.

* **Q3:** Ubuntu is:
  * **Options:**
    * A) Linux Distribution
    * B) Programming Language
    * C) Browser
    * D) Text Editor
  * **Correct Answer:** A) Linux Distribution
  * **Explanation:** Ubuntu is one of the most popular Linux distributions.

---

## CHAPTER: 1.2 Understanding the Terminal

* **Description:** Learn the purpose of the Linux terminal and basic command-line interaction.

---

### QUEST 1: THEORY
* **Type:** `theory_only`
* **Title:** Working with the Terminal
* **Est. Minutes:** 5
* **Outline:** Learn how the shell and terminal work.

* **Instructions (Slides):**

# Slide 1: What is a Terminal?

A Terminal is a text-based interface used to interact with Linux.

Users type commands and receive outputs.

Examples:

- GNOME Terminal
- Konsole
- XTerm

---

# Slide 2: What is a Shell?

A Shell is a command interpreter.

Common shells:

- Bash
- Zsh
- Fish
- Sh

The shell reads commands and executes them.

---

# Slide 3: Command Structure

General format:

```bash
command option argument
````

Example:

```bash
ls -l Documents
```

Where:

* ls = command
* -l = option
* Documents = argument

---

# Slide 4: Important Terminal Commands

```bash
pwd
whoami
date
uname
clear
```

Purpose:

* pwd → current directory
* whoami → current user
* date → system time
* uname → system information
* clear → clear terminal

---

# Slide 5: Benefits of Terminal Usage

Advantages:

* Fast
* Powerful
* Scriptable
* Remote administration
* Automation support

---

### QUEST 2: TERMINAL CHALLENGE

* **Type:** `terminal_challenge`

* **Title:** Basic Terminal Operations

* **Est. Minutes:** 5

* **Outline:** Practice command execution.

* **Instructions:**

Use terminal commands to:

1. Display current directory.
2. Display current user.
3. Create terminal practice folder.

* **Tasks:**

* **Task 1:**

  * **Instruction:** Create directory `/home/student/terminal_lab`
  * **Validation Type:** `file_exists`
  * **Validation Script:** `[ -d "/home/student/terminal_lab" ] && echo "OK" || echo "FAIL"`
  * **Expected Output:** `OK`

* **Task 2:**

  * **Instruction:** Create directory `/home/student/terminal_lab/session1`
  * **Validation Type:** `file_exists`
  * **Validation Script:** `[ -d "/home/student/terminal_lab/session1" ] && echo "OK" || echo "FAIL"`
  * **Expected Output:** `OK`

---

### QUEST 3: FILE EDITOR CHALLENGE

* **Type:** `editor_challenge`

* **Title:** Terminal Command Notes

* **Est. Minutes:** 8

* **Outline:** Record useful terminal commands.

* **Instructions:**

Create:

```text
/home/student/terminal_lab/commands.txt
```

Add:

```text
pwd
whoami
date
clear
```

* **Tasks:**

* **Task 1:**

  * **Instruction:** Create commands file.
  * **Validation Type:** `file_exists`
  * **Validation Script:** `[ -f "/home/student/terminal_lab/commands.txt" ] && echo "OK" || echo "FAIL"`
  * **Expected Output:** `OK`

* **Task 2:**

  * **Instruction:** Add command list.
  * **Validation Type:** `file_content`
  * **Validation Script:** `grep -q "whoami" /home/student/terminal_lab/commands.txt && echo "MATCH" || echo "NO_MATCH"`
  * **Expected Output:** `MATCH`

---

### QUEST 4: EXERCISE (MCQ)

* **Type:** `exercise`

* **Title:** Terminal Quiz

* **Est. Minutes:** 3

* **Outline:** Chapter comprehension check

* **Questions:**

* **Q1:** Which command displays the current directory?

  * **Options:**

    * A) cd
    * B) pwd
    * C) ls
    * D) clear
  * **Correct Answer:** B) pwd
  * **Explanation:** pwd prints the current working directory.

* **Q2:** Which command shows the logged-in user?

  * **Options:**

    * A) whoami
    * B) uname
    * C) date
    * D) cat
  * **Correct Answer:** A) whoami
  * **Explanation:** whoami prints the current username.

* **Q3:** Which component interprets commands?

  * **Options:**

    * A) Compiler
    * B) Kernel
    * C) Shell
    * D) BIOS
  * **Correct Answer:** C) Shell
  * **Explanation:** The shell interprets and executes commands.

```

