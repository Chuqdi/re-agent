"use client";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SelectOption from "@/components/ui/SelectOption";
import { createNewShowing, getAllContacts,getAllProperties } from "@/lib/firebase/firestore";
import { IContact, Showing,Property } from "@/types";
import { getAuth } from "firebase/auth";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const scheme = yup.object({
  address: yup.string().required("Required"),
  city: yup.string().required("Required"),
  state: yup.string().required("Required"),
  showingTime: yup.string().required("Required"),
  invitee: yup.string(),
   name:yup.string(),
   propertyID:yup.string(),
});

function AddNewShowing() {
  const router = useRouter();
  const [contacts, setContacts] = useState<IContact[]>();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
    try {
    const properties = await getAllProperties();
    
    setAllProperties(properties);
    } catch (error) {
    console.error("Error loading Properties:", error);
    }
    };
    loadProperties();
    }, []);


    useEffect(() => {
      getAllProperties().then((r) => {
        setAllProperties(r);
      });
    }, []);

   // console.log("WHAT IS PROPERTIES FROM DB===>", allProperties);


  const onSubmit = async (data: {
    address: string;
    city: string;
    state: string;
    showingTime: string;
    invitee: string;
    name:string;
    propertyID:string;
  }) => {
    console.log("FUNCTION STILL WORKING AT THIS POINT 1");
    setIsLoading(true);
   
    try {
      const requestData = {
        ...data,
        showingTime: new Date(data.showingTime).toISOString(),
        coordinates:{ //mar 31st assign to hezekiah to use geographical data
          lat:6.30,
          lng:4.01
        },
        invitees:[]
      };
      console.log("FUNCTION STILL WORKING AT THIS POINT 1");
      await createNewShowing(requestData);
      console.log("FUNCTION STILL WORKING AT THIS POINT 2 ");


      router.push("/dashboard/showings");
    } catch (error) {
      console.error("Error creating new showing", error);
    }
    setIsLoading(false);
  };
  const { values, handleSubmit, handleChange, errors, setFieldValue  } = useFormik({
    validationSchema: scheme,
    onSubmit,
    initialValues: {
      address: "",
      city: "",
      state: "",
      showingTime: "",
      invitee: "",
      name:" ",
      propertyID:" "
    },
  });

  const handlePropertyChange = (e:any) => {
   
    const selected = JSON.parse(e.target.value);

    console.log("WAHTS PARSED JSON--->",e.target.value)
  
    setFieldValue("address", selected.address);
    setFieldValue("city", selected.city);
    setFieldValue("state", selected.state);
    setFieldValue("invitee", selected.invitee);
    setFieldValue("propertyID", selected.propertyID);
     setFieldValue("name",e.target.value.name/*, selected.name*/);
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      getAllContacts(userId).then((r) => {
        setContacts(r);
      });
    }
  }, [auth]);

  return (
    <AppShell>
      {() => (
        <div className="w-full md:w-[80%] mx-auto bg-[#e8e8e82f] my-8 p-4 md:p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Add New Showing
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Specify showing details to add
              </p>
            </div>
            <div className="space-y-4">
              {/*
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Input
                    label="Address"
                    value={values.address}
                    //disabled={true}
                    onChange={handleChange("address")}
                    errorMessage={errors.address}
                    required
                    placeholder="eg. 3 Bedroom Terrace. Ikoyi"
                  />
                </div>

                <div className="flex-1">
                  <Input
                    label="State"
                    value={values.state}
                    //disabled={true}
                    onChange={handleChange("state")}
                    errorMessage={errors.state}
                    placeholder="eg. Rent"
                  />
                </div>

                <div className="flex-1">
                  <Input
                    label="City"
                    value={values.city}
                    //disabled={true}
                    onChange={handleChange("city")}
                    errorMessage={errors.city}
                    placeholder="eg. 30"
                  />
                </div>
              </div>
               */}
              <div className="mb-3 flex items-center justify-between gap-3  text-[13px]   text-gray-600">
               
                    
                  <SelectOption
                   className="text-[16px] bg-white"
                    value={values.name} //note, name is just being used to hold the property name
                    onChange={handlePropertyChange}
                    errorMessage={errors.name}
                    required
                    label="Property"
                  >
                    
                    <option className="text-[16px] bg-white"  value="">Select Property</option>
                    {allProperties.length > 0  && allProperties.map((property) => (
                      <option className="text-[16px] bg-white" key={property?.propertyID}
                      value={JSON.stringify(property)}
                      >
                        {property?.name} 
                      </option>
                     
                    ))}
                   
                  </SelectOption>
                
                
           </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    label="Showing Time"
                    value={values.showingTime}
                    onChange={handleChange("showingTime")}
                    errorMessage={errors.showingTime}
                    required
                    type="datetime-local"
                  />
                </div>

            
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                title="Cancel"
                variant="secondary"
                type="button"
                onClick={() => router.back()}
              />


              <Button isLoading={isLoading} title="Add Showing" type="submit" />
            </div>
          
          

          
          
          
          
          </form>
        </div>
      )}
    </AppShell>
  );
}

export default AddNewShowing;
