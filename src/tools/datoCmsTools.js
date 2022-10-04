import { useQuerySubscription } from "react-datocms"
import { SiteClient } from "datocms-client"
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../App";

//const token = "3331fc3477e7df4b7cb85836c2a684"

export const useStaticElement = (staticTextField, isStructuredText = true) => {
    const valueProperty = isStructuredText ? "{value }" : "";
    const token = useContext(AppContext).token;
    console.log("token", token)
    const DATOCMS_QUERY = `
		query AppQuery {
			staticelement  {
				${staticTextField} 
				${valueProperty}
			}
		}`;
    const { error, data } = useQuerySubscription({
        enabled: true,
        query: DATOCMS_QUERY,
        token,
    });

    //data ?? console.log(staticTextField, data?.staticelement[staticTextField]);
    //console.log(staticTextField, data?.staticelement[staticTextField])
    return [
        data?.staticelement[staticTextField].value ??
            data?.staticelement[staticTextField],
    ];
};

export const useAllElements = (model) => {
    const modelQueryRecordCount = {
        presenters: `        
            _allSpeakersMeta {
              count
            }
        `,
        stages: `
            _allStagesMeta {
                count
            }
        `
    }
    const DATOCMS_QUERY_RECORD_COUNT = `
        query AppQuery {
            ${modelQueryRecordCount[model]} 
        }`

    const  [dataCount] = useQuery(DATOCMS_QUERY_RECORD_COUNT)

    const modelQuery = {
        presenters: `
            allSpeakers(orderBy: [name_ASC], first: ${dataCount?.count ?? 0} ) 
                {
                    name
                    slug
                    highlighted
                    title
                    company
                    image {
                        url
                    }
                }
        `,
        stages: `
            allStages(orderBy: [order_ASC]) {
                id
                name
                online
                schedule {
                    id
                    start
                    title
                    description
                    speaker {
                        id
                        company
                        name
                        title
                        image {
                            url
                        }
                    }
                }
            }        
        `,
    };
    const DATOCMS_QUERY = `
        query AppQuery {
            ${modelQuery[model]} 
        }`

    const  [data] = useQuery(DATOCMS_QUERY)

    //console.log("dataCount", dataCount)
    //console.log("DATOCMS_QUERY", DATOCMS_QUERY)
    return [data]
};

const useQuery = (query) => {
    const token = useContext(AppContext).token;
    const { error, data } = useQuerySubscription({
        query,
        token
    });
    return [(data) && data[Object.keys(data)[0]]]
} 

export const useStatQuery = (statType) => {
    const token = useContext(AppContext).token;
    let query=`
        query onsiteQuery {
            _allRegistrationsMeta(filter: {onsite: {eq: "true"}}){
            count
            }
        }
    `
    const { error: onsiteError, data: onsite } = useQuerySubscription({
        query,
        token
    });

    query=`
        query onsiteQuery {
            _allRegistrationsMeta(filter: {onsite: {eq: "false"}}){
            count
            }
        }
`
    const { error: onlineError, data: online } = useQuerySubscription({
        query,
        token
    });

    query=`
    query registrationQuery {
        allRegistrations {
          stage {
            slug
          }
          name
          onsite
        }
      }
    `

    const {data: registration } = useQuerySubscription({
        query,
        token
    });

    query=`
        query onsiteQuery {
            _allRegistrationsMeta {
            count
            }
        }
    `

    const { error: allError, data: all } = useQuerySubscription({
        query,
        token
    });

    


    return [onsite, online, all, registration?.allRegistrations]
} 

export const useGetAll = (type, key=0) => {

    
    const [registration, setRegistration] = useState([])
    const token = useContext(AppContext).apiKey;
    console.log("site client token", token)
    
    useEffect(() => {
        const client = new SiteClient(token)
        client.items.all(
            {filter: {
                type
            }},
            {
                allPages: true
            }
        ).then(setRegistration)
    },[token, type])

    return registration

}
