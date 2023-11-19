import React, {Fragment, useEffect, useState} from 'react';
import {SkillProvider, SkillTree, SkillTreeGroup} from "./beautiful-skill-tree";
import {buildSkillTrees, fetchPowers} from "./data";
import {Props as SkillTreeProps} from "./beautiful-skill-tree/components/SkillTree";

function App() {
  const [skillTrees, setSkillTrees] = useState<SkillTreeProps[]>([])

  useEffect(() => {
    fetchPowers().then(buildSkillTrees).then(setSkillTrees)
  }, []);

  return (
      <div style={{marginBottom: 1000}}>
      <SkillProvider>
          <Fragment>
          {
              skillTrees.map(skillTree => (
                  <SkillTreeGroup>
                      {() =>
                  <SkillTree
                      key={skillTree.treeId}
                      {...skillTree}
                  />}
                  </SkillTreeGroup>
              ))
              }
          </Fragment>
      </SkillProvider>
      </div>
  );
}

export default App;
