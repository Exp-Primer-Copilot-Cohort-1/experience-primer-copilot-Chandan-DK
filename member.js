function addSkillsOfAMember(){
    var member = {
        name: 'John',
        skills: ['JavaScript', 'React', 'Node']
    }
    member.skills.push('HTML');
    member.skills.push('CSS');
    console.log(member);
}