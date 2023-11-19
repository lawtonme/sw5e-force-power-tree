import {Props as SkillTreeProps} from "./beautiful-skill-tree/components/SkillTree";
import {SkillType} from "./beautiful-skill-tree";
import {Fragment} from "react";

export interface Power {
    name: string
    powerTypeEnum: number
    powerType: string
    prerequisite: string | null
    level: number
    castingPeriodEnum: number
    castingPeriod: string
    castingPeriodText: string
    range: string
    duration: string
    concentration: boolean
    forceAlignmentEnum: string
    forceAlignment: string
    description: string
    higherLevelDescription: string | null
    contentTypeEnum: number
    contentType: string
    contentSourceEnum: number
    contentSource: string
    partitionKey: string
    rowKey: string
    timestamp: string
    eTag: string
}

export const fetchPowers = async (): Promise<Power[]> => {
    const response = await fetch(new Request('https://sw5eapi.azurewebsites.net/api/power'))
    const powers: Power[] = await response.json()
    return powers.filter(power => power.powerType === 'Force')
}

const buildSkillTree = (id: string, title: string, powers: Power[]): SkillTreeProps => {
    const powerLookupByName = powers.reduce((lookup: Record<string, Power>, power) => ({...lookup, [power.name]: power}), {})
    const powerChildrenLookup = powers.reduce((lookup: Record<string, string[]>, power) => {
        if (!power.prerequisite) {
            return lookup
        }

        return {...lookup, [power.prerequisite]: [...(lookup[power.prerequisite] || []), power.name]}
    }, {})

    const buildSkillTreeRecursive = (powers: Power[]): SkillType[] => powers.map(power => {
        const descriptions = power.description.replace('\t', '').split('\r\n')

        return {
            id: power.rowKey,
                title: power.name,
            tooltip: {
            content: (
                <div>
                    Level: {power.level}<br />
                    Casting period: {power.castingPeriodText.toLowerCase()}<br />
                    Range: {power.range.toLowerCase()}<br />
                    Duration: {power.duration.toLowerCase()}<br />
                    {power.concentration && <Fragment>Concentration: yes <br /></Fragment>}

                    {descriptions.map((d, i) => <p key={i} dangerouslySetInnerHTML={{__html: d}} />)}
                </div>
            )
        },
            children: buildSkillTreeRecursive((powerChildrenLookup[power.name] || []).map(power => powerLookupByName[power]))
        }
    })

    return {
        treeId: id,
        title: title,
        description: title,
        collapsible: true,
        data: buildSkillTreeRecursive(powers.filter(power => !power.prerequisite).sort((a, b) => a.level > b.level as any))
}
}

export const buildSkillTrees = (powers: Power[]): SkillTreeProps[] => {
    return [
        buildSkillTree('dark', 'Dark', powers.filter(power => power.forceAlignment === 'Dark')),
        buildSkillTree('universal', 'Universal', powers.filter(power => power.forceAlignment === 'Universal')),
    ]
}