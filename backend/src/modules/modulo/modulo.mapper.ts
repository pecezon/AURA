import { ModuleWithRelations } from "./modulo.types";

//ALL THIS MAPPERS ARE FOR GET RESPONSES ONLY
export function ModulesResponseReturn(findedModules : ModuleWithRelations[]){
    return findedModules.map(module => ({ //Made a explicit mapping instead of using unkwon
            id : module.id,
            title : module.title,
            order : module.order,
            courseId : module.courseId,
            createdAt : module.createdAt.toISOString(),
            contents : module.contents.map(content => ({
                id : content.id,
                moduleId : content.moduleId,
                type : content.type,
                title : content.title,
                content : content.content,
                url : content.url,
                order : content.order
            })),
            quizzes : module.quizzes.map(quiz => ({
                id: quiz.id,
                title: quiz.title,
                isGeneratedByAI: quiz.isGeneratedByAI,
                moduleId: quiz.moduleId,
                questions : quiz.questions.map(question => ({
                    id : question.id,
                    quizId : question.quizId,
                    text : question.text,
                    reactives : question.reactives.map(reactive => ({
                        id : reactive.id,
                        text : reactive.text,
                        isCorrect : reactive.isCorrect,
                        questionId : reactive.questionId
                    }))
                }))
            })),

            simulation: module.simulation
                ? {
                    id: module.simulation.id,
                    title: module.simulation.title,
                    content: module.simulation.content,
                    passingScore: module.simulation.passingScore,
                    moduleId : module.simulation.moduleId
                    }
                : null
        }))
}


export function ModuleResponseReturn(module : ModuleWithRelations){ //This is for a single Module Response
    return { //Made a explicit mapping instead of using unkwon
            id : module.id,
            title : module.title,
            order : module.order,
            courseId : module.courseId,
            createdAt : module.createdAt.toISOString(),
            contents : module.contents.map(content => ({
                id : content.id,
                moduleId : content.moduleId,
                type : content.type,
                title : content.title,
                content : content.content,
                url : content.url,
                order : content.order
            })),
            quizzes : module.quizzes.map(quiz => ({
                id: quiz.id,
                title: quiz.title,
                isGeneratedByAI: quiz.isGeneratedByAI,
                moduleId: quiz.moduleId,
                questions : quiz.questions.map(question => ({
                    id : question.id,
                    quizId : question.quizId,
                    text : question.text,
                    reactives : question.reactives.map(reactive => ({
                        id : reactive.id,
                        text : reactive.text,
                        isCorrect : reactive.isCorrect,
                        questionId : reactive.questionId
                    }))
                }))
            })),

            simulation: module.simulation
                ? {
                    id: module.simulation.id,
                    title: module.simulation.title,
                    content: module.simulation.content,
                    passingScore: module.simulation.passingScore,
                    moduleId : module.simulation.moduleId
                    }
                : null
        }
}