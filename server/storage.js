class MemStorage {
  constructor() {
    this.users = new Map();
    this.characters = [];
    this.conversations = [];
    this.scripts = [];
    this.rehearsals = [];
    this.nextId = 1;

    // 初始化《第十二夜》角色数据
    this.characters = [
      {
        id: 1,
        name: "薇奥拉",
        description: "聪明机智的女主角，化名塞巴斯蒂安为奥西诺公爵服务",
        avatar: "/api/placeholder/150/150",
        personality: "聪明、勇敢、忠诚、机智",
        background: "因船难失散，女扮男装投靠奥西诺公爵",
        playName: "第十二夜",
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "奥西诺公爵",
        description: "伊利里亚的统治者，深情的贵族",
        avatar: "/api/placeholder/150/150",
        personality: "浪漫、深情、有些自恋",
        background: "伊利里亚公爵，痴恋奥丽维亚",
        playName: "第十二夜",
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "奥丽维亚",
        description: "美丽的女伯爵，为兄长守孝",
        avatar: "/api/placeholder/150/150",
        personality: "高傲、美丽、情感丰富",
        background: "富有的女伯爵，拒绝奥西诺的求爱",
        playName: "第十二夜",
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "马伏里奥",
        description: "奥丽维亚的管家，自负且严肃",
        avatar: "/api/placeholder/150/150",
        personality: "自负、严肃、有野心",
        background: "奥丽维亚家的管家，梦想飞黄腾达",
        playName: "第十二夜",
        createdAt: new Date(),
      },
    ];
    this.nextId = 5;
  }

  async getUser(id) {
    return this.users.get(id);
  }

  async upsertUser(userData) {
    const user = {
      ...userData,
      updatedAt: new Date(),
      createdAt: this.users.get(userData.id)?.createdAt || new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async getCharacters() {
    return this.characters;
  }

  async getCharactersByPlay(playName) {
    return this.characters.filter(char => char.playName === playName);
  }

  async getCharacter(id) {
    return this.characters.find(char => char.id === id);
  }

  async createCharacter(character) {
    const newCharacter = {
      ...character,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.characters.push(newCharacter);
    return newCharacter;
  }

  async getConversation(userId, characterId) {
    return this.conversations.find(conv => 
      conv.userId === userId && conv.characterId === characterId
    );
  }

  async createConversation(conversation) {
    const newConversation = {
      ...conversation,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.push(newConversation);
    return newConversation;
  }

  async updateConversation(id, messages) {
    const index = this.conversations.findIndex(conv => conv.id === id);
    if (index === -1) {
      throw new Error("Conversation not found");
    }
    this.conversations[index] = {
      ...this.conversations[index],
      messages,
      updatedAt: new Date(),
    };
    return this.conversations[index];
  }

  async getScripts(userId) {
    if (userId) {
      return this.scripts.filter(script => script.userId === userId);
    }
    return this.scripts;
  }

  async getScript(id) {
    return this.scripts.find(script => script.id === id);
  }

  async createScript(script) {
    const newScript = {
      ...script,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.scripts.push(newScript);
    return newScript;
  }

  async updateScript(id, updates) {
    const index = this.scripts.findIndex(script => script.id === id);
    if (index === -1) {
      throw new Error("Script not found");
    }
    this.scripts[index] = {
      ...this.scripts[index],
      ...updates,
    };
    return this.scripts[index];
  }

  async getRehearsals(userId) {
    if (userId) {
      return this.rehearsals.filter(rehearsal => rehearsal.userId === userId);
    }
    return this.rehearsals;
  }

  async createRehearsal(rehearsal) {
    const newRehearsal = {
      ...rehearsal,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.rehearsals.push(newRehearsal);
    return newRehearsal;
  }

  async updateRehearsal(id, updates) {
    const index = this.rehearsals.findIndex(rehearsal => rehearsal.id === id);
    if (index === -1) {
      throw new Error("Rehearsal not found");
    }
    this.rehearsals[index] = {
      ...this.rehearsals[index],
      ...updates,
    };
    return this.rehearsals[index];
  }
}

const storage = new MemStorage();

module.exports = { storage };