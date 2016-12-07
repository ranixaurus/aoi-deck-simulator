//templates
var unit = {
    "name": "",
    "variant": "",
    "rarity": 0,
    "type": "",
    "element": "",
    "cost": 0,
    "maxEvolution": 0,
    "detail": [],
};
var detail = {
    "evolution": 0,
    "attack": 0,
    "hp": 0,
    "skill": [],
    "ability": null
};
var skill = {
    "type": "",
    "percentage": 0,
    "effect": []
};
var ability = {
    "type": "",
    "level": 0,
    "turnMin": 0,
    "turnMax": 0
}


//public methods
module.exports = {
    //create empty object to fill
    createUnit: function(){
        return JSON.parse(JSON.stringify(unit));
    },
    createDetail: function(){
        return JSON.parse(JSON.stringify(detail));
    },
    createSkill: function(){
        return JSON.parse(JSON.stringify(skill));
    },
    createAbility: function(){
        return JSON.parse(JSON.stringify(ability));
    },
    //create object from wiki data
    WIKI_HEADER: [
        "Name",
        "Rarity",
        "Type",
        "Element",
        "Skill 1",
        "Skill 1 %",
        "Skill 2",
        "Skill 2 %",
        "Ability",
        "Max Evo",
        "Max ATK",
        "Max HP",
        "Cost"
    ],
    createFromWiki: function(data){
        //preliminary
        var fullname = data[0];
        var hasVariant = fullname.indexOf("(");
        var name = fullname.substring(0, hasVariant > 0 ? hasVariant : fullname.length).trim();
        var variant = fullname.substring(fullname.indexOf("(")+1, fullname.indexOf(")"));
        
        //skill 1
        var s1 = this.createSkill();
        s1.type = data[4];
        s1.percentage = data[5];
        s1.effect = [];
        
        //skill2
        var s2 = this.createSkill();
        s2.type = data[4];
        s2.percentage = data[5];
        s2.effect = [];
        
        //ability
        var ability = this.createAbility();
        ability.type = data[8];
        ability.level = 0;
        ability.turnMin = 0;
        ability.turnMax = 0;
        
        //detail
        var detail = this.createDetail();
        detail.evolution = data[9];
        detail.attack = data[10];
        detail.hp = data[11];
        detail.skill.push(s1);
        detail.skill.push(s2);
        detail.ability = ability;
        
        //unit
        var unit = this.createUnit();
        unit.name = name;
        unit.variant = variant;
        unit.rarity = data[1];
        unit.type = data[2].trim();
        unit.element = data[3].trim();
        unit.cost = data[12];
        unit.maxEvolution = data[9];
        unit.detail[data[9]] = detail;
        
        return unit;
    }
};